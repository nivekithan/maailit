import LogoSvg from "@/components/abstract";
import EmailInput from "@/components/EmailInput";

export default function Home() {
  return (
    <div>
      <div className="absolute flex flex-col items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <LogoSvg className="bg-black size-24 p-4 rounded-xl fill-primary-blue mb-8" />
        <div className="flex flex-col items-center  text-center">
          <div className="flex items-center">
            <h1 className=" text-5xl font-semibold">
              Easy access to otp for testing
            </h1>
          </div>

          <p className="max-w-xl mt-2 text-lg text-slate-600">
            enter the slug of your required email and hit enter to start
            receiving emails on the mail, your id will be example@maailit.com
          </p>
          <p className="max-w-xl mt-1 text-base text-slate-600">
            We dont care about
            <span className="text-red-500 font-semibold">
              {" "}
              mobile users
            </span>{" "}
            get a bigger screen or dont use our app{" "}
            <span className="text-green-500 font-bold">{`:)`}</span>
          </p>
        </div>
        <div className="w-full mt-8">
          <EmailInput />
        </div>
      </div>
    </div>
  );
}
