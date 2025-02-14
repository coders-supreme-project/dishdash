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

// Form Schema
const formSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  idCard: z.string().min(1, "ID card is required"),
  rcDocument: z.string().min(1, "RC document is required"),
  firstName: z.string(), // No longer required
  lastName: z.string(), // No longer required
  streetAddress: z.string().min(1, "Street address is required"),
  streetAddress2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  image: z.string().min(1, "Restaurant image is required"),
  cuisineType: z.string().min(1, "Cuisine type is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  openingH: z.string().min(1, "Opening hours are required"),
  closingH: z.string().min(1, "Closing hours are required"),
});

export default function Home() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: "",
      idCard: "",
      rcDocument: "",
      firstName: user.customer.firstName, // Set default value from user
      lastName: user.customer.lastName, // Set default value from user
      streetAddress: "",
      streetAddress2: "",
      city: "",
      state: "",
      zipCode: "",
      image: "",
      cuisineType: "",
      contactNumber: "",
      openingH: "",
      closingH: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(user, "user");

      // Register the restaurant owner
      const ownerResponse = await axios.post(
        'http://localhost:3000/api/owner/create',
        {
          firstName: user.customer.firstName, // Use value from user
          lastName: user.customer.lastName || " ", // Use value from user
          userId: user.id,
        }
      );

      console.log('Restaurant owner registration response:', ownerResponse.data);

      // Register the restaurant
      const restaurantResponse = await axios.post(
        'http://localhost:3000/api/restaurant/create',
        {
          name: values.restaurantName,
          image: values.image,
          address: `${values.streetAddress}, ${values.streetAddress2}, ${values.city}, ${values.state}, ${values.zipCode}`,
          cuisineType: values.cuisineType,
          contactNumber: values.contactNumber,
          openingH: values.openingH,
          closingH: values.closingH,
          restaurantOwnerId: ownerResponse.data.restaurantOwner.id,
          restaurantRcId: values.rcDocument,
        }
      );

      console.log('Restaurant registration response:', restaurantResponse.data);
    
      // Handle media upload (ID card)
      const formDataMedia = new FormData();
      formDataMedia.append('idCard', values.idCard);
      formDataMedia.append('restaurantId', restaurantResponse.data.id);

      await axios.post('http://localhost:3000/api/media/create', formDataMedia);

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
              {/* Restaurant Name */}
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

              {/* Owner ID Card */}
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

              {/* Restaurant RC Document (Manual Input) */}
              <FormField
                control={form.control}
                name="rcDocument"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Restaurant RC Document <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter RC document number"
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Restaurant Image */}
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Restaurant Image <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
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

              {/* Personal Information */}
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
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={user.customer.firstName}
                            className="border-gray-300"
                            disabled
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
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            value={user.customer.lastName}
                            className="border-gray-300"
                            disabled
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Address */}
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

              {/* Cuisine Type */}
              <FormField
                control={form.control}
                name="cuisineType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Cuisine Type <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter cuisine type"
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Contact Number */}
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Contact Number <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter contact number"
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Opening Hours */}
              <FormField
                control={form.control}
                name="openingH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Opening Hours <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Closing Hours */}
              <FormField
                control={form.control}
                name="closingH"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      Closing Hours <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        className="border-gray-300"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
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