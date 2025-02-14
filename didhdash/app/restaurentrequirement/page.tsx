// filepath: /C:/Users/drong/OneDrive/Bureau/project/dishdash/didhdash/app/restaurentrequirement/page.tsx
"use client";
import '@/styles/globals.css';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Utensils } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  idCard: z.string().min(1, "ID card is required"),
  rcDocument: z.string().min(1, "RC document is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  streetAddress: z.string().min(1, "Street address is required"),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
});

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      idCard: "",
      rcDocument: "",
      firstName: "",
      lastName: "",
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Register the restaurant
      const restaurantResponse = await axios.post(
        'http://localhost:3000/api/restaurant/register',
        {
          restaurantName: values.restaurantName,
          firstName: values.firstName,
          lastName: values.lastName,
          streetAddress: values.streetAddress,
          streetAddress2: values.streetAddress2,
          city: values.city,
          state: values.state,
          zipCode: values.zipCode,
        },
        {
          withCredentials: true,
        }
      );

      console.log('Restaurant registration response:', restaurantResponse.data);

      // Handle media upload (ID card and RC document)
      const formDataMedia = new FormData();
      formDataMedia.append('idCard', values.idCard);
      formDataMedia.append('rcDocument', values.rcDocument);
      formDataMedia.append('restaurantId', restaurantResponse.data.restaurant.id);

      await axios.post('http://localhost:3000/api/media/create', formDataMedia, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log('Registration successful');

      // Show SweetAlert and redirect to login page
      Swal.fire({
        title: 'Restaurant registered successfully',
        text: 'Please login again',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/login');
      });

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Registration failed:', error.response?.data?.message || error.message);
      } else {
        console.error('Registration failed:', error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header with wave */}
      <div className="relative bg-[#ff6b00]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded border border-white p-2">
                <Utensils className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Restaurant Inc.</h1>
            </div>
            <div className="text-right text-sm text-white">
              <p>Camden, AR 77701</p>
              <p>inquire@restaurant.mail</p>
              <p>222 555 777</p>
            </div>
          </div>
        </div>
        {/* Wave SVG */}
        <div className="absolute -bottom-1 left-0 w-full">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 40C840 33 960 27 1080 30C1200 33 1320 47 1380 53.3L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Restaurant Registration Form
            </h2>
            <p className="text-gray-600">Please complete the information below.</p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 rounded-lg bg-white p-6 shadow-lg"
            >
              <FormField
                control={form.control}
                name="restaurantName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Restaurant Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter restaurant name"
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="idCard"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Owner ID Card <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file ? file.name : "");
                        }}
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rcDocument"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Restaurant RC Document <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          onChange(file ? file.name : "");
                        }}
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Personal Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          First Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter first name"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Last Name <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter last name"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Address
                </h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Street Address <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter street address"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="streetAddress2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">
                          Street Address 2
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apartment, suite, etc. (optional)"
                            className="border-gray-300"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            City <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter city"
                              className="border-gray-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            State <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter state"
                              className="border-gray-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">
                            ZIP Code <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter ZIP code"
                              className="border-gray-300"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#ff6b00] hover:bg-[#ff8533]"
              >
                Submit Application
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}