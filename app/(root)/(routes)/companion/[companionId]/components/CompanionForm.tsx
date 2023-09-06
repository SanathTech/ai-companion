"use client";

import axios from "axios";
import * as z from "zod";
import { Category, Companion } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are Elon Musk. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.
`;

const SEED_CHAT = `Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?
Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.
Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.
Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`;

interface CompanionFormProps {
  initialData: Companion | null;
  categories: Category[];
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required.",
  }),
  description: z.string().min(1, {
    message: "Description is required.",
  }),
  instructions: z.string(),
  seed: z.string(),
  src: z.string(),
  srcGen: z.string().min(1, {
    message: "Category is required.",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required.",
  }),
});

function CompanionForm({ initialData, categories }: CompanionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      src: "",
      srcGen: "No",
      categoryId: undefined,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!values.instructions) {
        const instructions = await axios.post(
          "/api/chatgpt/instructions",
          values
        );
        values.instructions = instructions.data;
      }
      if (!values.seed) {
        const seed = await axios.post("/api/chatgpt/seed", values);
        values.seed = seed.data;
      }
      // console.log(values.src);
      if (!values.src || values.srcGen === "Yes") {
        const image = await axios.post("/api/chatgpt/image", values);
        console.log(image);
        values.src = image.data;
      }
      if (initialData) {
        // Update Companion Functionality
        await axios.patch(`/api/companion/${initialData.id}`, values);
        // await axios.delete(`/api/history/${initialData.id}`);
      } else {
        // Create Companion Functionality
        await axios.post("/api/companion", values);
      }
      toast({
        description: "Success.",
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong.",
      });
    }
  };
  return (
    <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-10"
        >
          <div className="space-y-2 w-full">
            <div>
              <h3 className="text-lg font-medium">General Information</h3>
              <p className="text-sm text-muted-foreground">
                General information about your Companion
              </p>
            </div>
            <Separator className="bg-primary/10" />
          </div>
          <FormField
            name="src"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4">
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                {!initialData && (
                  <FormDescription>
                    If no image is provided, one will be generated for you.
                  </FormDescription>
                )}

                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="Elon Musk"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is how your AI Companion will be named.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="CEO & Founder of Tesla"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Short description for your AI Companion.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 md:col-span-1">
                  <FormLabel>Category</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="h-[calc(42vh)] overflow-y-auto">
                      {categories.map((category) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select a category for your AI
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {initialData && (
              <FormField
                name="srcGen"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Generate New Image</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="">
                        <SelectItem
                          className="cursor-pointer"
                          key="No"
                          value="No"
                        >
                          No
                        </SelectItem>
                        <SelectItem
                          className="cursor-pointer"
                          key="Yes"
                          value="Yes"
                        >
                          Yes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Generate a new image for your AI
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          {!initialData && (
            <div className="w-full flex justify-center">
              <Button size="lg" disabled={isLoading}>
                {isLoading
                  ? "Generating"
                  : initialData
                  ? "Edit your companion"
                  : "Create your companion"}
                {isLoading ? (
                  <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                ) : (
                  <Wand2 className="w-4 h-4 ml-2" />
                )}
              </Button>
            </div>
          )}
          {initialData && (
            <div className="space-y-8">
              <div className="space-y-2 w-full">
                <div>
                  <h3 className="text-lg font-medium">Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Leave this section blank to auto-generate instructions and
                    example conversation.
                  </p>
                </div>
                <Separator className="bg-primary/10" />
              </div>
              <FormField
                name="instructions"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-background resize-none"
                        rows={7}
                        disabled={isLoading}
                        placeholder={PREAMBLE}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      {
                        "Describe in detail your companion's backstory and relevant details"
                      }
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="seed"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Example Conversation</FormLabel>
                    <FormControl>
                      <Textarea
                        className="bg-background resize-none"
                        rows={7}
                        disabled={isLoading}
                        placeholder={SEED_CHAT}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Write couple of examples of a human chatting with your AI
                      companion, write expected answers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full flex justify-center">
                <Button size="lg" disabled={isLoading}>
                  {isLoading
                    ? "Generating"
                    : initialData
                    ? "Edit your companion"
                    : "Create your companion"}
                  {isLoading ? (
                    <Loader2 className="ml-2 w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 ml-2" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}

export default CompanionForm;
