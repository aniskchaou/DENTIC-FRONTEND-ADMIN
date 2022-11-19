export function LoadJSFiles() {

  let scripts = [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" },

    { src: "assets/js/init.js" },
    { src: "assets/js/main.js" }

  ]
  //Append the script element on each iteration


  for (let i = 0; i < scripts.length; i++) {
    const node = document.createElement('script');
    node.src = scripts[i].src;
    node.type = 'text/javascript';
    node.async = false;
    node.charset = 'utf-8';
    document.getElementById('root').appendChild(node);
    console.log(i)
  }


}