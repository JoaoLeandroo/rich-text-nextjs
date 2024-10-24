"use client";
import RichTextEditor from "./RichTextEditor";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from 'uuid';
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function extractTextFromHTML(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent?.trim() || "";
}

const formSchema = z.object({
  post: z.string().refine(
    (value) => {
      return extractTextFromHTML(value).trim().length >= 5;
    },
    {
      message: "The text must be at least 5 characters long after trimming",
    }
  ),
});

type FormData = z.infer<typeof formSchema>;

const RichText = () => {

    const [responses, setResponses] = useState<{ id: string; content: string }[]>([]);

    const form = useForm({
        mode: "onTouched",
        resolver: zodResolver(formSchema),
        defaultValues: {
          post: "",
        },
      });
    
      const onSubmit: SubmitHandler<FormData> = (data) => {
        console.log(data);

        const newResponse = {
          id: uuidv4(),
          content: data.post,  // Adiciona o conteúdo postado
        };
    
        // Atualiza o estado com o novo conteúdo
        setResponses((prevResponses) => [...prevResponses, newResponse]);
    
        // Reseta o campo do formulário após o envio
        form.reset();

      };
    
      return (
        <div className="max-w-3xl mx-auto py-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="post"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rich Text Editor</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="mt-4">Registrar</Button>
            </form>
          </Form>

          <div className="mt-10">
          {responses.map((response) => (
            <div key={response.id} className="mb-2 border-b pb-2">
              <div dangerouslySetInnerHTML={{ __html: response.content }} />
            </div>
          ))}
          </div>
        </div>
      );
};

export default RichText;
