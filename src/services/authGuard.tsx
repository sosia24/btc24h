'use client'
import { useRouter } from "next/navigation";
import { useWallet } from "@/services/walletContext";
import { useEffect, ComponentType } from "react";

function withAuthGuard<P>(WrappedComponent: ComponentType<any>) {
  return function AuthGuard(props: P) {
    const router = useRouter();
    const { address } = useWallet();

    useEffect(() => {
      if (!address) {
        router.push("/"); 
      }
    }, [address, router]);

    if (!address) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

export default withAuthGuard;
