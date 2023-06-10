import bodyParser from "body-parser"
import cors from "cors"
import express, {Express,NextFunction,Request, Response} from "express"
import { Model, Sequelize } from "sequelize"
import { DataType } from "sequelize-typescript"

const app=express()
const port=8000
app.use(cors())

// Connection setup
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'admin',
  database: 'itemslist',
  define:{
    timestamps:false
  }
});

//Model Definition
class Items extends Model{
    public itemNo!:number;
    public description!:string;
    public unit!: string;
    public qty!:number
    public rate!:Float32Array;
    public amount!: Float32Array;

}

Items.init( 
    {
        itemNo:{
            type:DataType.NUMBER,
            primaryKey: true,
            allowNull: false
        },
        description:{
            type:DataType.STRING,
            allowNull:false
        },
        unit:{
            type:DataType.STRING, 
            allowNull:true
        },
        qty:{
            type:DataType.NUMBER,
            allowNull:true
        },
        rate:{
            type:DataType.FLOAT,
            allowNull:true
        },
        amount:{
            type:DataType.FLOAT,
            allowNull:true
        }
    },{
        sequelize,
        tableName:"items"
    }

);

app.use(bodyParser.json())



// Get all items
app.get('/', async (req, res) => {
  try {
    const items = await Items.findAll();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//Delete an item
app.delete("/delete", async(req,res)=>{

    try{
        const item= await Items.findOne({
            where:{description:req.body.description}
        })
        if(!item){
            return res.status(404)
        }
        item.destroy();
        res.json("Deleted successfully")

    }
    catch(err){
        res.status(500).json({ message: 'Internal server error' });
    }
})


//Edit an existing item
app.put('/edit', async (req, res) => {

  try {
    const item= await Items.findOne({
        where:{
            description:req.body.description}
        })
    if (!item) {
      return res.status(404);
    }
    await item.update(req.body);
    console.log(item)
    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//Add a new item
app.post('/add', async (req, res) => {

  try {
    const newitem = await Items.create(req.body);
    console.log(newitem)
    res.json(newitem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.listen(port, () => {
  console.log('Server listening on port: ' ,port);
});

