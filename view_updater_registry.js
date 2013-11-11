function ViewUpdaterRegistry()
{
  this.viewUpdaters = []
  
  this.update = function(funcname)
  {
    for(var i = 0; i < this.viewUpdaters.length; i++) {
      this.viewUpdaters[i][funcname]()
    }
  }

  this.register = function(viewUpdater)
  {
    this.viewUpdaters.push(viewUpdater)
  }
}

