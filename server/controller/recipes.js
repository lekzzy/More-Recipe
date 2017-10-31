import recipes from '../models/index';

//Recipe Class

class Recipe {

    //This method add a recipe to the More-Recipes database
    static addRecipe(req, res) 
    {
        const data = {
            id: recipes.length + 1,
            name: req.body.name,
            description: req.body.description,
            user: req.body.User,
            imageUrl: req.body.image,
            upvotes: 0,
            downvotes: 0,
            favorited: 0,
            views: 0, 
            review: req.body.review
        }

        recipes.push({data});
           return res.status(200).json({message: 'Recipe successfully added!', data });
        


    }


    //This method Modifies or Updates the More-Recipes database
    static modifyRecipe(req, res, error) 
    {
        for (let partRecipe = 0; partRecipe < recipes.length; partRecipe += 1) 
        {
            if (recipes[partRecipe].id === parseInt(req.params.recipeId, 10))
             {
                recipes[partRecipe].name = req.body.name;
                recipes[partRecipe].description = req.body.description;

                    return res.status(200).json({message: 'Recipe successfully updated!', recipes});

            }
        }
    }

    //This method delete a recipe from the More-Recipes database 
    static deleteRecipe(req, res)
     {
        for (let partRecipe = 0; partRecipe < recipes.length; partRecipe += 1)
         {
            if (recipes[partRecipe].id === parseInt(req.params.recipeId, 10))
            { 
                recipes.splice(partRecipe, 1);
                return res.status(200).json({message: 'Recipe Deleted Successfully', recipes});
            }
        }
        return res.status(404).json({message: 'recipe not found', error: true});
    }

    //This method gets all recipes without sorting
    static getAllRecipes(req, res)
    {
        return res.status(200).json({recipes});
    }

   //This method post review of onethe recipe in the More-recipes database
   static postReview(req, res)
    {
        for (let partRecipe = 0; partRecipe < recipes.length; partRecipe += 1)
         {
            if (recipes[partRecipe].id === parseInt(req.params.recipeId, 10))
             {
                console.log(recipes);
                recipes[i].reviews.push(req.body.reviews);
                return res.status(200).json({recipes, message: 'success', error: false});
            }
        }
        return res.status(404).json({message: 'recipe not found', error: true});
    }
    
    //This methos gets all recipes and sorts in descending order
    static getSortedRecipe(req, res) 
    {
        if (req.query.sort === 'upvotes') 
        {
            if (req.query.order === 'desc')
             {
                recipes.sort((recipe1, recipe2) => recipe1.upvotes < recipe2.upvotes);
             } 
             else 
             {
                recipes.sort((recipe1, recipe2) => recipe1.upvotes > recipe2.upvotes);
            }
        }
        
        return res.status(200).json({recipes});
  }
}

export default Recipe;

   

