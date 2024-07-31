"use client";
import React, { useState } from "react";
import DesignerSidebar from "./DesignerSidebar";
import {
  DragEndEvent,
  useDndMonitor,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "./FormElements";
import { useDesigner } from "@/store/designer";
import { idGenerator } from "@/lib/idGenerator";
import { Button } from "@/components/ui/button";
import { BiSolidTrash } from "react-icons/bi";
type Props = {};

export default function Designer({}: Props) {
  const {
    elements,
    addElement,
    setSelectedElement,
    selectedElement,
    removeElement,
  } = useDesigner();
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;

      // Ensure both active and over elements are defined
      if (!active || !over) return;

      const activeEventData = active.data?.current;
      const overEventData = over.data?.current;

      // Ensure both activeData and overData are defined
      if (!activeEventData || !overEventData) return;

      const isDraggingSidebarButton = activeEventData.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = overEventData.isDesignerDropArea;

      // First scenario: Dropping sidebar button over designer drop area
      if (isDraggingSidebarButton && isDroppingOverDesignerDropArea) {
        const elementType = activeEventData.type;
        const newElement = FormElements[elementType as ElementsType].construct(
          idGenerator()
        );
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf =
        overEventData.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf =
        overEventData.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement =
        isDroppingOverDesignerElementTopHalf ||
        isDroppingOverDesignerElementBottomHalf;

      // Second scenario: Dropping sidebar button over designer element
      if (isDraggingSidebarButton && isDroppingOverDesignerElement) {
        const elementType = activeEventData.type;
        const newElement = FormElements[elementType as ElementsType].construct(
          idGenerator()
        );
        const overElementId = overEventData.elementId;

        // Find the index of the element over which we are dropping
        const overElementIndex = elements.findIndex(
          (el) => el.id === overElementId
        );
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }

        // Determine the index where the new element should be inserted
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);
        return;
      }

      // Third scenario: Dragging designer element over another designer element
      const isDraggingDesignerElement = activeEventData.isDesignerElement;
      if (isDroppingOverDesignerElement && isDraggingDesignerElement) {
        const activeElementId = activeEventData.elementId;
        const overElementId = overEventData.elementId;

        // Find the indices of the active and over elements
        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeElementId
        );
        const overElementIndex = elements.findIndex(
          (el) => el.id === overElementId
        );

        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found");
        }

        // Make a copy of the active element and remove it from its original position
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeElementId);

        // Determine the index where the active element should be inserted
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        // Insert the active element at the computed index
        addElement(indexForNewElement, activeElement);
      }
    },
  });
  return (
    <div className="flex w-full h-full">
      <div
        className="p-4 w-full"
        onClick={() => {
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-4 ring-primary ring-inset"
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              Drop here
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;
  const DesignerElement = FormElements[element.type].designerComponent;
  return (
    <div
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={() => {
        setSelectedElement(element);
      }}
    >
      <div
        ref={topHalf.setNodeRef}
        className="absolute w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute w-full bottom-0 h-1/2 rounded-b-md"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button
              className="flex justify-center h-full border rounded-md rounded-l-none bg-red-500"
              variant={"outline"}
              onClick={() => removeElement(element.id)}
            >
              <BiSolidTrash className="h-6 w-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className="absolute top-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"></div>
      )}
      <div
        className={cn(
          "flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-100",
          mouseIsOver && "opacity-30",
          topHalf.isOver && "border-t-4 border-t-foreground",
          bottomHalf.isOver && "border-b-4 border-b-foreground"
        )}
      >
        <DesignerElement elementInstance={element} />
      </div>

      {bottomHalf.isOver && (
        <div className="absolute bottom-0 w-full rounded-md h-[7px] bg-primary rounded-b-none"></div>
      )}
    </div>
  );
}
