export function replaceWithCDN(url:string) {
    const blobStorageBaseUrl = 'https://yeeplatform.blob.core.windows.net';
    //const cdnBaseUrl = 'https://yeefmcontent.azureedge.net';
    // const cdnBaseUrl = 'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net';
    const cdnBaseUrl ='https://yeefmpremiumcontent.azureedge.net';
    
    if (url && url.startsWith(blobStorageBaseUrl)) {
      return url.replace(blobStorageBaseUrl, cdnBaseUrl);
    }
    return url;
  }

export function replaceWithFrontDoor(url:string) {
    const blobStorageBaseUrl = 'https://yeeplatform.blob.core.windows.net';
    const frontDoorBaseUrl = 'https://yeefmpremiumcontentfrontdoor-cyfpezerhzbmhzbr.z02.azurefd.net';
    
    if (url && url.startsWith(blobStorageBaseUrl)) {
      return url.replace(blobStorageBaseUrl, frontDoorBaseUrl);
    }
    return url;
}