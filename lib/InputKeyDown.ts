    export const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = /[0-9.\-]/;

    // Allow control/navigation keys
    if (
      e.key === "Backspace" ||
      e.key === "Delete" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Tab"
    ) {
      return;
    }

    // Block anything not allowed
    if (!allowedKeys.test(e.key)) {
      e.preventDefault();
    }
  };