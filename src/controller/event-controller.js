const OPEN_TIME = new Date('2026-02-06T17:49:00').getTime();
const EXPIRATION_TIME = 20000; // 30 minutes

export class EventController {

    

    getOpenStatus = async(req, res) => {

        if(Date.now() < OPEN_TIME){
            return res.status(200).json({openTime: OPEN_TIME, isOpen:false});
        }

        return res.status(200).json({redirect: "/queue" ,isOpen:true,expirationTime: EXPIRATION_TIME});

    } 

    getExpirationTime = async(req, res) => {

        return res.status(200).json({expirationTime: EXPIRATION_TIME});
    
    }

}