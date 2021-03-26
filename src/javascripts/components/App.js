import React from 'react'

export default function Main() {
    return (
        <div className="react-stuff">
            <h1>React Code Here - this is App component in src\javascripts\components\App.js</h1>
            <p>
                Every time you make a change to react components the code
                is compiled via webpack.config.js . It takes the javascripts and converts them from ES6
                to ES5.  Also compiles SASS and converts to CSS, and saves 
                it in root/public. Once run the public folder should
                contain an images, javascripts and stylesheets folders.
            </p>
            <p>
                The above compilation is configured in webpack.config.js. You can use this file to
                tell where to compile to (e.g. in this case root/public).  There is also a watch
                line that tells webpack to automatically recompile the code.  If that's not in there then 
                you'd have to do >npm run deploy
            </p>
            
                <pre>{`
                Anatomy of how this page is loaded:
                in src/javascripts/config/routes
                    router.get['/', indexPage]
                        loads '../controllers/index.js':
                            loads src/views/layout.ejs:
                                Renders header.ejs and footer.ejs. 
                                AND
                                    index.ejs
                                        which renders React App.js via id=main and 
                                        src/javascripts/main.js which executes:
                                            ReactDOM dot render App  
                                    OR
                                    alt.ejs
                                        which renders React Alt.js via id=alt and 
                                        src/javascripts/main.js which executes:
                                            ReactDOM dot render Alt 
                `}</pre>
            
        </div>
    )
}



