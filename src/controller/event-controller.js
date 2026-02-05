const OPEN_TIME = new Date('2026-02-05T20:07:00').getTime();


export class EventController {

    

    getOpenStatus = async(req, res) => {

        if(Date.now() < OPEN_TIME){
            return res.status(200).json({openTime: OPEN_TIME, isOpen:false});
        }

        return res.status(200).json({redirect: "/queue" ,isOpen:true});

    } 

}