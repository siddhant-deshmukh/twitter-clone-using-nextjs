import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExploreSVG, HomeSVG, MsgsSVG, NotificationSVG } from "../svgElemets";

function BottomNavBar() {
    const pathname = usePathname();

    return (
        <>
            <ul className="fixed bg-white dark:bg-black bg-opacity-80 dark:bg-opacity-80 flex border-t shadow justify-between  w-full sm:hidden bottom-0 left-0  h-12 ">
                <Link href='/home' className="flex place-content-center  group text-base items-center hover:bg-gray-200 dark:hover:bg-gray-800 w-full  text-gray-900 dark:text-white">
                    <HomeSVG fill='none' strokeWidth="1.75" />
                </Link>
                <Link href='#' className="flex place-content-center group text-base items-center hover:bg-gray-200 dark:hover:bg-gray-800 w-full  text-gray-900 dark:text-white">
                    <ExploreSVG fill='none' strokeWidth="1.75" />
                </Link>
                <Link href='#' className="flex place-content-center group text-base items-center hover:bg-gray-200 dark:hover:bg-gray-800 w-full  text-gray-900 dark:text-white">
                    <NotificationSVG fill='none' strokeWidth="1.75" />
                </Link>
                <Link href='#' className="flex place-content-center group text-base items-center hover:bg-gray-200 dark:hover:bg-gray-800 w-full  text-gray-900 dark:text-white">
                    <MsgsSVG fill='none' strokeWidth="1.75" />
                </Link>
            </ul>
            <Link
                className="absolute right-5 bottom-16 block sm:hidden   p-4 w-fit rounded-full font-medium  text-white   bg-[#1D9BF0] md:w-full"
                href={pathname + '?' + 'tweet-modal'} >
                <svg viewBox="0 0 24 24" aria-hidden="true" fill="white" className="block md:hidden w-8 h-8  mx-auto">
                    <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z">
                    </path>
                </svg>
            </Link>
        </>
    )
}

export default BottomNavBar