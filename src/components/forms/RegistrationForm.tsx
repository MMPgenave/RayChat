import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registrationSchema } from "@/lib/validations";
import { toast } from "react-toastify";
import { socket } from "@/socket";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/auth-slice";
import { useNavigate } from "react-router-dom";
export default function RegistrationForm({ type }: { type: string }) {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof registrationSchema>) {
    console.log(values);
    if (type === "client") {
      socket.emit("register-user", { clientId: values.email, name: values.username });
      dispath(setUser({ clientId: values.email, name: values.username }));
      toast.success("با موفقیت وارد شدید");
      navigate("/clientChat");
    } else {
      socket.emit("register-agent");
      dispath(setUser({ clientId: values.email, name: values.username }));
      toast.success("با موفقیت وارد شدید");
      navigate("/agentChat");
    }
  }

  return (
    <div className=" w-1/3 max-sm:w-full mx-auto ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border p-4 rounded-md ">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="نام کاربری" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="ایمیل" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className=" w-full">
            {type === "client" ? "ثبت نام" : "ورود"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
