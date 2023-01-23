import Post from '../models/Post.js';
import PostModel from '../models/Post.js'
export const getAll = async(req,res) => {
    try{
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    }catch(err){
        res.status(500).json({
            message:'Не удалось получить статьи'
        })
    }
}

export const create = async (req,res) => {
    try{
        const doc = new PostModel({
            title : req.body.title,
            text : req.body.text,
            imageUrl : req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });
        
        const post = await doc.save();
        res.json(post)
    }catch(err){
        res.status(500).json({
            message:'Не удалось создать статью'
        })
    }
}

export const getOne = async(req,res) => {
    try{
        const postId = req.params.id
        PostModel.findOneAndUpdate({
            _id:postId,
        },{
            $inc:{
                viewsCount:1
            }
        },{
            returnDocument:'after',
        },(err,doc)=>{
            if(err){
                return res.status(500).json({
                    message:'Не удалось получить статью',
                })
            }
            if(!doc){
                return res.status(404).json({
                    message : 'Статья не найдена'
                })
            }
            res.json(doc)
        })
    }catch(err){
        res.status(500).json({
            message:'Не удалось получить статью',
        })
    }
}

export const removePost = async(req,res) => {
    try{
        const postId = req.params.id
        PostModel.findByIdAndDelete({
            _id:postId,
        },(err,doc) => {
            if(err){
                return res.status(404).json({
                    message : 'Статья не удалена'
                })
            }
            if(!doc){
                return res.status(404).json({
                    message : 'Статья не найдена'
                })
            }
            res.json({
                success:true
            })
        })

    }catch(err){
        res.status(500).json({
            message:'Не удалось удалить статью',
        })
    }
}

export const updatePost = async(req,res) => {
    try{
        const postId = req.params.id;
        await PostModel.findByIdAndUpdate({
            _id:postId
        }, {
            title : req.body.title,
            text:req.body.text,
            imageUrl:req.body.imageUrl,
            user:req.userId,
            tags:req.body.tags
        })
        res.json({
            success:true
        })
    }catch(err){
        res.status(500).json({
            message:'Не удалость обновить статью'
        })
    }
}