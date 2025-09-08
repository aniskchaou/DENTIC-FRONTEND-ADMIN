import { Typography } from "@mui/material";
import React, { useEffect } from "react";

export default function DentalPapayaViewer({ dcmUrl = [] }) {
  useEffect(() => {
    if (window.papaya) {
      // Remove previous viewer if exists
      if (document.getElementById('papaya-viewer')) {
        document.getElementById('papayaContainer').innerHTML = '';
      }
      // Filter out invalid URLs
      const images = (Array.isArray(dcmUrl) ? dcmUrl : [dcmUrl])
        .filter(url => typeof url === "string" && url.trim().length > 0);

      if (images.length === 0) return; // Don't initialize if no valid images

      // Papaya.js viewer options with more features enabled
      window.papaya.Container.addViewer("papayaContainer", {
        images: images,
        showControls: true,
        showImageButtons: true,
        showOrientation: true,
        showCrosshairs: true,
        showRuler: true,
        showScaleBar: true,
        showScrollbars: true,
        showDownload: true,
        showInfo: true,
        showTrivial: true,
        showColorTable: true,         // Show color table tool
        showOverlay: true,            // Show overlay tool
        showGraph: true,              // Show graph tool
        showMemory: true,             // Show memory usage
        showHelp: true,               // Show help button
        showPreferences: true,        // Show preferences/settings
        showAbout: true,              // Show about dialog
        showLogo: true,               // Show Papaya logo
        showZoom: true,               // Show zoom tool
        showMinMax: true,             // Show min/max tool
        showVoxelValue: true,         // Show voxel value tool
        showCoordinate: true,         // Show coordinate tool
        showSeries: true,             // Show series tool
        panelWidth: 350,
        panelGap: 20,
        mainViewWidth: 1100,
        mainViewHeight: 600,
      });

      // Fix Papaya.js CSS for light theme and visibility
      const papayaContainer = document.getElementById('papayaContainer');
      if (papayaContainer) {
        papayaContainer.style.background = "#fff";
        papayaContainer.style.color = "#222";
      }
      // Override Papaya toolbar and panel styles for better visibility
      const style = document.createElement('style');
      style.innerHTML = `
        .papaya {
          background: #fff !important;
          color: #222 !important;
        }
        .papaya-toolbar, .papaya-menu-bar, .papaya-menu {
          background: #f5f5f5 !important;
          color: #222 !important;
        }
        .papaya-menu-bar-button, .papaya-menu-bar-button-selected {
          background: #e3f2fd !important;
          color: #1976d2 !important;
        }
        .papaya-viewer {
          background: #fff !important;
        }
        .papaya-panel {
          background: #fafafa !important;
          color: #222 !important;
        }
        .papaya-slider {
          background: #e3f2fd !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, [dcmUrl]);

  return (
    <div className="p-4">
      <Typography variant="h5" sx={{ mb: 2, color: "#1976d2", fontWeight: 700 }}>
        Dental Imaging Viewer
      </Typography>
      <div
        id="papayaContainer"
        className="papaya"
        style={{ width: "1200px", height: "600px", margin: "0 auto", borderRadius: "12px", boxShadow: "0 4px 24px rgba(25,118,210,0.08)" }}
      ></div>
    </div>
  );
}