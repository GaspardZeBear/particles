pat='<script type="module" crossorigin src="./assets/js/basic.js"></script>'
#pat='console.log("Basic")'
fInFile="../dist/basic.html"
jsInFile="../dist/assets/js/basic.js"
fOutFile="fOut.html"

def embed() :
  with open(fInFile,encoding='utf-8') as fIn :
    with open(fOutFile,"w",encoding='utf-8') as fOut :
      for l in fIn.readlines() :
        if pat in l :
          fOut.write("<script>")
          with open(jsInFile,encoding='utf-8') as jsIn :
            for j in jsIn.readlines() :
              fOut.write(j)
          fOut.write("</script>")
        else :
          fOut.write(l)

def create() :
  with open(fOutFile,"w",encoding='utf-8') as fOut :
    fOut.write("<html>")
    fOut.write("<body>")
    fOut.write("<script>")
    with open(jsInFile,encoding='utf-8') as jsIn :
      for j in jsIn.readlines() :
        fOut.write(j)
    fOut.write("</script>")
    fOut.write("</body>")
    fOut.write("</html>")

def cmp() :
  with open(fOutFile,"w",encoding='utf-8') as fOut :
    with open(jsInFile,encoding='utf-8') as jsIn :
      for l in jsIn.readlines() :
        fOut.write(l)

#cmp()
#embed()
create()
