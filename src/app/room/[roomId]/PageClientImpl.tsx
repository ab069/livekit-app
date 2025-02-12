"use client";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setRoomName, setHq } from "../../../redux/slices/conferenceSlice";
//import { SettingsMenu } from "../../../../lib/SettingsMenu";
import { ConnectionDetails } from "../../../../lib/types";
import {
  formatChatMessageLinks,
  LiveKitRoom,
  LocalUserChoices,
  PreJoin,
  VideoConference,
} from "@livekit/components-react";
import { RoomOptions, VideoPresets, Room, RoomConnectOptions } from "livekit-client";
import { useRouter } from "next/navigation";
import React from "react";

const CONN_DETAILS_ENDPOINT = process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/token";
const SHOW_SETTINGS_MENU = process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU == "true";

export function PageClientImpl() {
  const dispatch = useDispatch();

  // Use useSelector to access room details from Redux store
  const { roomName, region, hq } = useSelector((state: any) => state.conference);

  const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(undefined);
  const preJoinDefaults = React.useMemo(() => ({
    username: "",
    videoEnabled: true,
    audioEnabled: true,
  }), []);

  const [connectionDetails, setConnectionDetails] = React.useState<ConnectionDetails | undefined>(undefined);

  const handlePreJoinSubmit = React.useCallback(async (values: LocalUserChoices) => {
    setPreJoinChoices(values);
    if (!roomName) {
      console.error("❌ Error: Room name is missing!");
      return;
    }

    const url = new URL(CONN_DETAILS_ENDPOINT, window.location.origin);
    url.searchParams.append("roomName", roomName);
    url.searchParams.append("participantName", values.username);
    

    const connectionDetailsResp = await fetch(url.toString());
    if (!connectionDetailsResp.ok) {
      console.error("Failed to fetch connection details:", connectionDetailsResp.statusText);
      return;
    }
    const connectionDetailsData = await connectionDetailsResp.json();
    setConnectionDetails(connectionDetailsData);
  }, [roomName, region]);

  const handlePreJoinError = React.useCallback((e: any) => console.error(e), []);

  return (
    <main data-lk-theme="default" style={{ height: "100%" }}>
      {connectionDetails === undefined || preJoinChoices === undefined ? (
        <div style={{ display: "grid", placeItems: "center", height: "100%" }}>
          <PreJoin
            defaults={preJoinDefaults}
            onSubmit={handlePreJoinSubmit}
            onError={handlePreJoinError}
          />
        </div>
      ) : (
        <VideoConferenceComponent
          connectionDetails={connectionDetails}
          userChoices={preJoinChoices}
          options={{ hq }}
        />
      )}
    </main>
  );
}

function VideoConferenceComponent(props: {
  userChoices: LocalUserChoices;
  connectionDetails: ConnectionDetails;
  options: {
    hq: boolean;
  };
}) {
  const e2eePassphrase =
    typeof window !== "undefined" ;

  const worker =
    typeof window !== "undefined" &&
    e2eePassphrase &&
    new Worker(new URL("livekit-client/e2ee-worker", import.meta.url));
  const e2eeEnabled = !!(e2eePassphrase && worker);

  const roomOptions = React.useMemo((): RoomOptions => {
    return {
      videoCaptureDefaults: {
        deviceId: props.userChoices.videoDeviceId ?? undefined,
        resolution: props.options.hq ? VideoPresets.h2160 : VideoPresets.h720,
      },
      publishDefaults: {
        dtx: false,
        videoSimulcastLayers: props.options.hq
          ? [VideoPresets.h1080, VideoPresets.h720]
          : [VideoPresets.h540, VideoPresets.h216],
        red: !e2eeEnabled,
      },
      audioCaptureDefaults: {
        deviceId: props.userChoices.audioDeviceId ?? undefined,
      },
      adaptiveStream: { pixelDensity: "screen" }, // Fix here by ensuring it's "screen"
      dynacast: true,
    };
  }, [props.userChoices, props.options.hq]);

  const room = React.useMemo(() => new Room(roomOptions), [roomOptions]);

  const connectOptions = React.useMemo(() => ({
    autoSubscribe: true,
  }), []);

  const router = useRouter();
  const handleOnLeave = React.useCallback(() => router.push("/"), [router]);
  const handleError = React.useCallback((error: Error) => {
    console.error(error);
    alert(`Encountered an unexpected error, check the console logs for details: ${error.message}`);
  }, []);
  const handleEncryptionError = React.useCallback((error: Error) => {
    console.error(error);
    alert(
      `Encountered an unexpected encryption error, check the console logs for details: ${error.message}`,
    );
  }, []);

  return (
    <>
      <LiveKitRoom
        room={room}
        token={props.connectionDetails.participantToken}
        serverUrl={props.connectionDetails.serverUrl}
        connectOptions={connectOptions}
        video={props.userChoices.videoEnabled}
        audio={props.userChoices.audioEnabled}
        onDisconnected={handleOnLeave}
        onEncryptionError={handleEncryptionError}
        onError={handleError}
      >
        <VideoConference
          chatMessageFormatter={formatChatMessageLinks}
          SettingsComponent={SHOW_SETTINGS_MENU ? SettingsMenu : undefined}
        />
      </LiveKitRoom>
    </>
  );
}
