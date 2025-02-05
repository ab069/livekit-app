import * as React from 'react';
import { PageClientImpl } from './PageClientImpl';


export default function Page({
  params,
  searchParams,
}: {
  params: { roomName: string };
  searchParams: {
    // FIXME: We should not allow values for regions if in playground mode.
    region?: string;
    hq?: string;
    
  };
}) {
  
  const hq = searchParams.hq === 'true' ? true : false;

  return (
    <PageClientImpl roomName={params.roomName} region={searchParams.region} hq={hq}  />
  );
}
