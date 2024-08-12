var express = require("express");
var router = express.Router();

const Item = require("../models/items")

//Pour chopper tous les items 
router.get("/", (req, res) => { 

    Item.find()
        .then(data => {
            if (data.length > 0)
                {
                    res.json({result: true, data: data})
                }

            else
                {
                    res.json({result: false, error : "Objet non trouvé"})
                }   
        }
    );
})


//Trouver un item
router.get("/byId/:itemId", (req, res) => {

    const itemId = req.params.itemId;

    if (!itemId)
            {
                res.json({result: false, error : "Erreur !"})
            }
    
    Item.findById( itemId )
        .then(data => {
            //console.log(data) Ici on récupère bien toute les infos de BDD
            if (data)
                {
                    res.json({result: true, data : data})
                }
            
            else 
                {
                    res.json({result: false, error : " Erreur de manipulation"})
                }
        });        
});


//Acheter un item
router.post("/buyItem", (req, res) => {

    Item.findById( req.body.id )
        .then(data => {
            if(data !== null) 
                    {
                        res.json({result: true, data : data})
                    }
            else
                    {
                        res.json({result: false, error : " no data"})
                    }
        })

})

//Pour vendre un item
router.delete("/byId/:itemId", (req, res) => {
    
    const itemId = req.params.itemId;

    if (!itemId)   
        {
            console.log(itemId)
            res.json({result: false, error: "Échec !"})
            return;
        }
    //console.log(itemId)
    Item.deleteOne({ _id : itemId })
        .then(deleteDoc => {
            if (deleteDoc.deletedCount > 0)
                {
                    res.json({result: true});
                }

            else
                {
                    res.json({result: false, error : "Transanction non aboutie !"})
                }
        });

})


module.exports = router ; 