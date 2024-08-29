import Link from "next/link";
import Feed from "./Feed";

const MenuSection = () => {
  return (
    <section className="w-full flex flex-col lg:flex-row h-full min-h-screen">
      <div
        style={{
          background: `url(/coffee.jpeg)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "cover",
        }}
        className="w-full lg:w-[50%] p-12 flex flex-col justify-between items-center min-h-[57vh] md:min-h-screen h-full">
        <Link href="/" className="font-semibold cursor-pointer">
          <img src=
            "logo/marichcafe.jpeg"
            alt="Sample Image" className="rounded-full h-24" />
        </Link>
        <div className="text-center">
          <h2 className="text-[#FACE8D] font-dancing text-[30px] md:text-[50px] leading-none">
            Check Out
          </h2>
          <h1 className="text-[#D9232A] mt-3 font-dancing font-medium text-[50px] md:text-[80px] leading-none">
            Our Menus
          </h1>
        </div>

        <Link
          href="/"
          className="tracking-widest font-semibold text-[14px] cursor-pointer rounded-[100px] flex items-center justify-center py-4 px-12 text-white bg-black" >
          Home
        </Link>
      </div>
      <div className="w-full lg:w-[50%] flex flex-col items-center md:h-screen">
        <Feed />
      </div>
    </section>
  );
};

export default MenuSection;
