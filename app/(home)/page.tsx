/* eslint-disable @typescript-eslint/no-explicit-any */
import { UnderConstruction } from "@/components/shared/under-construction.tsx/under-construction";
import { jwtDecode } from "jwt-decode";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg0YWE5OTE3NTQyZTE3OTZiNjg4YmUiLCJwaG9uZSI6IjAxODI2NzMyODU1Iiwicm9sZSI6ImFkbWluIiwiZWlpbiI6MTUyMDc0LCJpYXQiOjE3NTM3MTc0ODMsImV4cCI6MTc1MzgwMzg4M30.Mar0FiPBLC1DN1KnpyD7FnuktZbtn0pbwYdWtCnmIks";

export default function page() {
  const decodedToken: any = jwtDecode(token);

  console.log(decodedToken);
  return (
    <div className="w-full h-full">
      <UnderConstruction />
    </div>
  );
}
