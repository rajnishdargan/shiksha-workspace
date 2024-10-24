import "reflect-metadata";
import React, { useEffect } from "react";
import { useRef } from "react";

interface PlayerConfigProps {
  playerConfig: any;
}

const SunbirdEpubPlayer = ({ playerConfig }: PlayerConfigProps) => {
  const sunbirdEpubPlayerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Dynamically load the Sunbird PDF Player script from CDN
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-epub-player-web-component@1.4.0/sunbird-epub-player.js";
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/@project-sunbird/sunbird-epub-player-web-component@1.4.0/styles.css";
    document.head.appendChild(link);

    const playerElement = sunbirdEpubPlayerRef.current;

    const handlePlayerEvent = (event: any) => {
      console.log("Player Event", event.detail);
    };
    const handleTelemetryEvent = (event: any) => {
      console.log("Telemetry Event", event.detail);
    };

    // Ensure the script has loaded before adding event listeners
    script.onload = () => {
      playerElement?.addEventListener("playerEvent", handlePlayerEvent);
      playerElement?.addEventListener("telemetryEvent", handleTelemetryEvent);
    };

    return () => {
      playerElement?.removeEventListener("playerEvent", handlePlayerEvent);
      playerElement?.removeEventListener(
        "telemetryEvent",
        handleTelemetryEvent
      );
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="player-grid">
      <sunbird-epub-player
        player-config={JSON.stringify(playerConfig)}
        ref={sunbirdEpubPlayerRef}
      ></sunbird-epub-player>
    </div>
  );
};

export default SunbirdEpubPlayer;
