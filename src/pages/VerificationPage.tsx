import VerificationFailure from "@/components/forms/authforms/VerificationFailure";
import VerificationSucess from "@/components/forms/authforms/VerificationSucess";
import { useState } from "react";

function VerificationPage() {
  const [success, SetIsSucess] = useState(true);
  return (
    <div className="min-h-screen justify-center items-center flex">{success ? <VerificationSucess /> : <VerificationFailure />}</div>
  );
}

export default VerificationPage;
