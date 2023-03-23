import Image from "next/image"
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { requestSignedZuzaluUUIDUrl, useFetchParticipant, useSemaphoreSignatureProof } from "@pcd/passport-interface"
import { usePassportModalContext } from "../../context/PassportModalContext"
import getUserSession from "../../hooks/getUserSession"
import { getUserOnID } from "../../hooks/getUserOnID"

const supabase = createBrowserSupabaseClient()

const MainSection = () => {
    const { openPassportModal, setOpenPassportModal } = usePassportModalContext()
    const userObj = getUserSession()
    console.log("user object new", userObj)

    const PASSPORT_URL = "https://zupass.eth.limo/"

    function requestProofFromPassport(proofUrl: string) {
        const popupUrl = `/popup?proofUrl=${encodeURIComponent(proofUrl)}`
        window.open(popupUrl, "_blank", "width=360,height=480,top=100,popup")
    }

    function requestSignedZuID() {
        const proofUrl = requestSignedZuzaluUUIDUrl(PASSPORT_URL, `${window.location.origin}/popup`)
        requestProofFromPassport(proofUrl)
    }
    return (
        <div className="flex min-h-[90vh] h-full w-full relative">
            <button onClick={requestSignedZuID}> Passport </button>
            <div className="z-[10] bg-gradient-linear absolute top-0 h-full w-full bg-opacity-80 transform scale-x-[-1]" />
            <Image
                src="/mountains.png"
                layout="fill"
                objectFit="cover"
                className="absolute top-0 w-full h-full bg-no-repeat"
            />
            <div className="absolute bottom-0 right-0 w-[600px] h-[660px]">
                <Image
                    src="/zulalu-vector.png"
                    layout="fill"
                    objectFit="contain"
                    objectPosition="bottom right"
                    className="w-full h-full z-[11] bg-no-repeat"
                />
            </div>
            <div className="z-[11] flex w-full px-[72px] py-[180px]">
                <div className="flex w-[700px] flex-col gap-5">
                    <h1 className="text-[18px] md:text-[24px] text-blue md:mb-5 md:text-gray-900 ">
                        March 25 to May 25, 2023
                    </h1>
                    <h1 className="text-[30px] md:text-[60px] md:mb-10">
                        A first-of-its-kind pop-up city community in Montenegro
                    </h1>
                    <h1 className="text-[18px] md:text-[24px] md:w-[80%]">
                        Join 200 core residents for healthy living, co-working and learning through co-created events on
                        synthetic biology, ZK, public goods, longevity, and network states.
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default MainSection