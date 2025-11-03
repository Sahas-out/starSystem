const getFileContents = async (filename) => {
  const file = await fetch(filename); 
  const body = await file.text();
  return body;
};

const faceStringParse = (strings) => {
  const vertices = [];
  for (const str of strings) {
    vertices.push(str.split('/'))
  }
  return vertices;
};

const stringsToFloat32 = (strings) => {
  const numbers = [];
  for (const str of strings) {
    numbers.push(parseFloat(str));
  }
  return numbers;
};

function objParser(obj) {
  // Map to store unique vertex attribute combinations
  const vertexMap = new Map();
  const vertices = [];
  const indices = [];

  // Helper to create a unique key for each vertex attribute combination
  function vertexKey(v, vt, vn) {
    // return `${v}/${vt}/${vn}`;
    return `${v}`;
  }

  for (const face of obj.faces) {
    for (const vert of face) {
      // OBJ indices are 1-based, so subtract 1
      const vIdx = parseInt(vert[0], 10) - 1;
      const vtIdx = vert[1] ? parseInt(vert[1], 10) - 1 : undefined;
      const vnIdx = vert[2] ? parseInt(vert[2], 10) - 1 : undefined;
      
      if (vtIdx === undefined || vnIdx === undefined) {
        console.log("error");
      }
      const key = vertexKey(vIdx, vtIdx, vnIdx);

      if (!vertexMap.has(key)) {
        // Push position
        vertices.push(...obj.positions[vIdx]);
        // Push texCoord if present
        if (vtIdx !== undefined && obj.texCoords[vtIdx]) {
          vertices.push(...obj.texCoords[vtIdx]);
        }
        // Push normal if present
        if (vnIdx !== undefined && obj.normals[vnIdx]) {
          vertices.push(...obj.normals[vnIdx]);
        }
        vertexMap.set(key, vertexMap.size);
      }
      indices.push(vertexMap.get(key));
    }
  }
  return { name: obj.name,vertices, indices };
}

async function fileParser(fileContent){

  const lines = fileContent.split('\n');
  let obj = {'name':'','positions':[],'texCoords':[],'normals':[],'faces':[]}

  for (const line of lines) {
    const [ command, ...values ] = line.split(' ', 4);

    if (command === 'o') {
      obj.name = values[0]
    } else if (command === 'v') {
      obj.positions.push(stringsToFloat32(values))
    } else if (command === 'vt') {
      obj.texCoords.push(stringsToFloat32(values))
    } else if (command === 'vn') {
      obj.normals.push(stringsToFloat32(values))
    } else if (command === 'f') {
      obj.faces.push(faceStringParse(values)) 
    }

  }
  return objParser(obj)
}

export async function mainParser(...filenames){
  const objectArrays = await Promise.all(
    filenames.map(async (filename) => {
      const contents = await getFileContents(filename);
      return fileParser(contents);
    })
  );
  return objectArrays.flat(1);

}

