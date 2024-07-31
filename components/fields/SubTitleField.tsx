"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from "../FormElements";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useDesigner } from "@/store/designer";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LuHeading1, LuHeading2 } from "react-icons/lu";
const type: ElementsType = "SubTitleField";

const extraAttributes = {
  title: "SubTitle field",
};

const propertiesSchema = z.object({
  title: z.string().min(2).max(50),
});

export const SubTitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LuHeading2,
    label: "SubTitle field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

type ElementInstance = {
  elementInstance: FormElementInstance;
};

function DesignerComponent({ elementInstance }: ElementInstance) {
  const element = elementInstance as CustomInstance;
  const { title } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">SubTitle field</Label>
      <p className="text-lg">{title}</p>
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
}) {
  const element = elementInstance as CustomInstance;

  const { title } = element.extraAttributes;
  return <p className="text-lg">{title}</p>;
}

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: ElementInstance) {
  const { updateElement } = useDesigner();
  const element = elementInstance as CustomInstance;

  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      title: element.extraAttributes.title,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesSchemaType) {
    const { title } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        title,
      },
    });
  }
  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
