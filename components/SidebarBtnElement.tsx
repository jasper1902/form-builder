import React from "react";
import { FormElement } from "./FormElements";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Props = { formElement: FormElement };

export default function SidebarBtnElement({ formElement }: Props) {
  const { label, icon: Icon } = formElement.designerBtnElement;
  const darggable = useDraggable({
    id: `designer-btn-${formElement.type}`,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={darggable.setNodeRef}
      variant={"outline"}
      className={cn(
        "flex flex-col gap-2 h-[120px] w-[120px] cursor-grab",
        darggable.isDragging && "ring-2 ring-primary"
      )}
      {...darggable.listeners}
      {...darggable.attributes}
    >
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}

export function SidebarBtnElementDragOverlay({ formElement }: Props) {
  const { label, icon: Icon } = formElement.designerBtnElement;
  return (
    <Button
      variant={"outline"}
      className={"flex flex-col gap-2 h-[120px] w-[120px] cursor-grab"}
    >
      <Icon className="h-8 w-8 text-primary cursor-grab" />
      <p className="text-xs">{label}</p>
    </Button>
  );
}
