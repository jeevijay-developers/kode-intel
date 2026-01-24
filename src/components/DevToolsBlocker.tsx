import { useEffect } from "react";

/**
 * DevToolsBlocker - Prevents right-click context menu and common dev tools shortcuts.
 * This provides basic protection against casual inspection of the website.
 * Note: Determined developers can still bypass these measures.
 */
export function DevToolsBlocker() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Disable common keyboard shortcuts for dev tools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Dev Tools)
      if (e.ctrlKey && e.shiftKey && e.key === "I") {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.key === "J") {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Inspect Element)
      if (e.ctrlKey && e.shiftKey && e.key === "C") {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+S (Save Page)
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }

      // Cmd+Option+I (Mac Dev Tools)
      if (e.metaKey && e.altKey && e.key === "i") {
        e.preventDefault();
        return false;
      }

      // Cmd+Option+J (Mac Console)
      if (e.metaKey && e.altKey && e.key === "j") {
        e.preventDefault();
        return false;
      }

      // Cmd+Option+C (Mac Inspect)
      if (e.metaKey && e.altKey && e.key === "c") {
        e.preventDefault();
        return false;
      }

      // Cmd+Option+U (Mac View Source)
      if (e.metaKey && e.key === "u") {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection (optional - uncomment if needed)
    // const handleSelectStart = (e: Event) => {
    //   e.preventDefault();
    //   return false;
    // };

    // Disable drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);
    // document.addEventListener("selectstart", handleSelectStart);

    // Disable console methods in production
    if (import.meta.env.PROD) {
      const noop = () => {};
      
      // Store original console for internal use if needed
      const originalConsole = { ...console };
      
      // Override console methods
      Object.keys(console).forEach((key) => {
        if (typeof (console as any)[key] === "function") {
          (console as any)[key] = noop;
        }
      });
    }

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      // document.removeEventListener("selectstart", handleSelectStart);
    };
  }, []);

  return null;
}

export default DevToolsBlocker;
