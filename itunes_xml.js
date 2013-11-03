function ItunesXml(xml_doc)
{
  this.doc = xml_doc
  this.top_dict = new ItunesDict(this.doc.children[0].children[0])
  this.tracks = this.top_dict.get("Tracks")
}

ItunesXml.decorateNode = function(node)
{
  if(node.nodeName == "dict")
  {
    return new ItunesDict(node)
  }
  else
  {
    return node
  }
  return "huh"
}

ItunesXml.prototype.getTrackById = function(id)
{
  return this.tracks.get(id)
}

function ItunesDict(dict_node)
{
  this.node = dict_node
  if (dict_node.nodeName != "dict")
  {
    throw "Expected a dict node, but got a " + dict_node.nodeName + "."
  }
}

ItunesDict.prototype.get = function(key) {
  children = this.node.children
  key = key.toString()
  for(var i = 0; i < children.length; i += 2)
  {
    key_node = children[i]
    if(key_node.textContent == key && key_node.nodeName == "key")
    {
      node = children[i + 1]
      return ItunesXml.decorateNode(node)
    }
  }
  return null
}