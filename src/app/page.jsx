import Image from "next/image";
import Banner from "@/Components/Home/Banner";
import Products from "@/Components/Home/Products";
import { getServerSession } from "next-auth";
import Test from "@/Components/Test";
import { authOptions } from "@/lib/authOptions";
export default async function Home() {

  const session = await getServerSession(authOptions);

  return (
    <div className="space-y-20 ">
      <div>{
        `server session ${JSON.stringify(session)}`
      }</div>
      <Test></Test>
      <section>
        <Banner></Banner>
      </section>
      <section>
        <Products></Products>
      </section>

    </div>
  );
}
