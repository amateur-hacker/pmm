import { useEffect, useState } from "react";

import { isAndroid, isIOS, isMobile, isTablet } from "react-device-detect";

function useIsTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice((isMobile || isTablet) && (isAndroid || isIOS));
  }, []);

  return isTouchDevice;
}

export { useIsTouchDevice };
