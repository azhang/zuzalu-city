import { NextApiRequest, NextApiResponse } from "next"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import ical from "ical-generator"

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
        .order("startDate", { ascending: true })
        .order("startTime", { ascending: true })
        if (response.error === null) {
            const cal = ical({
                prodId: '//superman-industries.com//ical-generator//EN',
                sessions: response.data.map((session: any) => {
                    const sessionStartDate = new Date(`${session.startDate}T${session.startTime}`);
                    const sessionEndDate = new Date(sessionStartDate.getTime() + session.duration * 60000); // add session duration in minutes
                    const description = `Location: ${session.location}\n\nTags: ${JSON.stringify(session.tags)}\n\nTrack: ${session.track}\n\nFormat: ${session.format}\n\nLevel: ${session.level}\n\n${session.description}\n\n\n\nMore Info: https://zuzalu.city/event/${session.event_id}/session/${session.id}`;
                        const url = `https://zuzalu.city/event/${session.event_id}/session/${session.id}`

                        return {
                        start: sessionStartDate,
                        end: sessionEndDate,
                        summary: `[${session.session_slug}] ${session.name} (${session.session_type})`,
                        description: description,
                        location: session.location,
                        url: url
                    }
                })
            })

            cal.serve(res)
        } else res.status(response.status).send(response.error)
    } catch (err: any) {
        console.log("error: ", err)
        res.status(500).json({ statusCode: 500, message: err })
    }
}
