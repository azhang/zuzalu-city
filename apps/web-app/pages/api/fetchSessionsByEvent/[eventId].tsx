import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createServerSupabaseClient({ req, res })

    let userId = 0

    const {
        data: { session }
    } = await supabase.auth.getSession()

    try {
        if (session) {
            await supabase
                .from("users")
                .select()
                .eq("uui_auth", session.user.id)
                .single()
                .then((user: any) => {
                    userId = user.data.id
                })
        }
    } catch (err) {
        userId = 0
        console.log(err)
    }

    try {
        const response = await supabase
            .from("sessions")
            .select("*, participants (*), favoritedSessions:favorited_sessions (*)")
            .eq("participants.user_id", userId)
            .eq("favoritedSessions.user_id", userId)
            .eq("event_id", req.query.eventId)
            .order("startDate", { ascending: true })
            .order("startTime", { ascending: true })
        if (response.error === null) {
            res.status(200).send(response.data)
        } else res.status(response.status).send(response.error)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}
