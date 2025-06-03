"use client";

import Button from "@/components/Button.jsx";
import Input from "@/components/Input.jsx";
import InputError from "@/components/InputError.jsx";
import Label from "@/components/Label.jsx";
import Link from "next/link";
import { useAuth } from "@/hooks/auth";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const RegisterPage = () => {
  const { register } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: "/dashboard",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [planId, setPlanId] = useState("");
  const [errors, setErrors] = useState([]);

  // Check for plan_id in query parameters
  useEffect(() => {
    const plan = searchParams.get("plan_id");
    if (!plan) {
      // Redirect to plans page if no plan is selected
      router.push("/plans");
    } else {
      setPlanId(plan);
    }
  }, [searchParams, router]);

  const submitForm = (event) => {
    event.preventDefault();

    register({
      firstname,
      middlename,
      lastname,
      contact_number: contactNumber,
      address,
      email,
      password,
      password_confirmation: passwordConfirmation,
      plan_id: planId,
      setErrors,
    });
  };

  return (
    <div className="max-w-md mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Register</h1>
      <form onSubmit={submitForm}>
        {/* First Name */}
        <div>
          <Label htmlFor="firstname">First Name</Label>
          <Input
            id="firstname"
            type="text"
            value={firstname}
            className="block mt-1 w-full"
            onChange={(event) => setFirstname(event.target.value)}
            required
            autoFocus
          />
          <InputError messages={errors.firstname} className="mt-2" />
        </div>

        {/* Middle Name */}
        <div className="mt-4">
          <Label htmlFor="middlename">Middle Name</Label>
          <Input
            id="middlename"
            type="text"
            value={middlename}
            className="block mt-1 w-full"
            onChange={(event) => setMiddlename(event.target.value)}
          />
          <InputError messages={errors.middlename} className="mt-2" />
        </div>

        {/* Last Name */}
        <div className="mt-4">
          <Label htmlFor="lastname">Last Name</Label>
          <Input
            id="lastname"
            type="text"
            value={lastname}
            className="block mt-1 w-full"
            onChange={(event) => setLastname(event.target.value)}
            required
          />
          <InputError messages={errors.lastname} className="mt-2" />
        </div>

        {/* Contact Number */}
        <div className="mt-4">
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input
            id="contact_number"
            type="text"
            value={contactNumber}
            className="block mt-1 w-full"
            onChange={(event) => setContactNumber(event.target.value)}
          />
          <InputError messages={errors.contact_number} className="mt-2" />
        </div>

        {/* Address */}
        <div className="mt-4">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            type="text"
            value={address}
            className="block mt-1 w-full"
            onChange={(event) => setAddress(event.target.value)}
          />
          <InputError messages={errors.address} className="mt-2" />
        </div>

        {/* Email Address */}
        <div className="mt-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            className="block mt-1 w-full"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <InputError messages={errors.email} className="mt-2" />
        </div>

        {/* Password */}
        <div className="mt-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            className="block mt-1 w-full"
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="new-password"
          />
          <InputError messages={errors.password} className="mt-2" />
        </div>

        {/* Confirm Password */}
        <div className="mt-4">
          <Label htmlFor="passwordConfirmation">Confirm Password</Label>
          <Input
            id="passwordConfirmation"
            type="password"
            value={passwordConfirmation}
            className="block mt-1 w-full"
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            required
          />
          <InputError
            messages={errors.password_confirmation}
            className="mt-2"
          />
        </div>

        {/* Plan ID (Hidden) */}
        <input type="hidden" value={planId} />

        <div className="flex items-center justify-end mt-4">
          <Link
            href="/login"
            className="underline text-sm text-gray-600 hover:text-gray-900"
          >
            Already registered?
          </Link>

          <Button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white">
            Register
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
