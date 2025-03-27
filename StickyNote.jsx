import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { updateSticky } from "../services/stickyService";
import "./StickyNote.css";

/**
 * StickyNote Component
 *
 * A draggable, resizable sticky note that can be edited and saved to the server.
 * Features include:
 * - Drag and drop functionality
 * - Resize capability
 * - Text editing
 * - Z-index management for layering
 * - Debounced saving
 *
 */
function StickyNote({
  _id,
  colorClass,
  initialPosition,
  initialSize,
  initialZIndex,
  initialText,
  onDelete,
  maxZIndex,
  setMaxZIndex,
}) {
  // State management
  const [isEditable, setIsEditable] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [cardPosition, setCardPosition] = useState(initialPosition);
  const [cardSize, setCardSize] = useState(initialSize);
  const [zIndex, setZIndex] = useState(initialZIndex);
  const [text, setText] = useState(initialText);

  // Refs
  const cardRef = useRef(null);
  const saveTimeout = useRef(null);

  /**
   * Saves the current state of the sticky note to the server
   */
  const saveCard = async () => {
    try {
      await updateSticky({
        _id,
        color: colorClass,
        position: cardPosition,
        size: cardSize,
        zIndex,
        text,
      });
    } catch (error) {
      console.error("Error saving card:", error);
    }
  };

  /**
   * Debounced save function to prevent excessive API calls
   * Waits 300ms after the last change before saving
   */
  const debouncedSave = () => {
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      saveCard();
    }, 300);
  };

  /**
   * Effect hook to save sticky note when its properties change
   * Triggers on changes to position, size, z-index, or text
   */
  useEffect(debouncedSave, [cardPosition, cardSize, zIndex, text]);

  /**
   * Moves the sticky note to the front by updating its z-index
   */
  const moveToFront = () => {
    const newZIndex = maxZIndex + 1;
    setZIndex(newZIndex);
    setMaxZIndex(newZIndex);
  };

  /**
   * Handles the start of dragging operation
   */
  const handleMouseDown = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
    setDragging(true);
    document.body.style.userSelect = "none"; // Disable text highlight when dragging
  };

  /**
   * Effect hook to handle dragging functionality
   * Updates position based on mouse movement
   */
  useEffect(() => {
    if (!dragging) {
      return;
    }

    let distanceFromTop = startPosition.y - cardRef.current.offsetTop;
    let distanceFromLeft = startPosition.x - cardRef.current.offsetLeft;

    /**
     * Updates position during mouse movement
     */
    const mouseMove = (e) => {
      setIsEditable(false);

      let newY =
        e.clientY - distanceFromTop <= 0 ? 0 : e.clientY - distanceFromTop;
      let newX =
        e.clientX - distanceFromLeft <= 0 ? 0 : e.clientX - distanceFromLeft;

      setCardPosition({ x: newX, y: newY });
    };

    /**
     * Handles mouse up event to stop dragging
     */
    const mouseUp = (e) => {
      setDragging(false);
      document.body.style.userSelect = ""; // Enable text highlight when done dragging
    };

    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    return () => {
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
      setDragging(false);
    };
  }, [dragging]);

  /**
   * Effect hook to track sticky note size changes
   * Uses ResizeObserver to monitor size changes
   */
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setCardSize({ width, height });
      }
    });

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, []);

  /**
   * Handles text changes in the sticky note
   */
  const handleTextAreaChange = (e) => {
    setText(e.target.value);
  };

  /**
   * Cleanup effect to clear any pending save timeouts
   * Prevents memory leaks on component unmount
   */
  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  return (
    <div
      className={`my-card ${colorClass}`}
      style={{
        left: `${cardPosition.x}px`,
        top: `${cardPosition.y}px`,
        height: `${cardSize.height}px`,
        width: `${cardSize.width}px`,
        zIndex: zIndex,
      }}
      ref={cardRef}
      onMouseDown={moveToFront}
    >
      <div
        className={`sticky-header ${colorClass}`}
        onMouseDown={handleMouseDown}
      >
        <FontAwesomeIcon
          className="delete-btn"
          icon={faCircleXmark}
          onClick={() => onDelete(_id)}
        />
      </div>
      <textarea
        className={`${colorClass}`}
        type="text"
        readOnly={!isEditable}
        placeholder="Double click to type..."
        onDoubleClick={() => setIsEditable(true)}
        onBlur={() => setIsEditable(false)}
        onChange={handleTextAreaChange}
        defaultValue={initialText}
      ></textarea>
    </div>
  );
}

export default StickyNote;
