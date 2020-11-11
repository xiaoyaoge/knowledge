油库后台： 
1.  map.bsm.position.bsmFindPosition  
2.  kyemap.mapservice.reverseGeocoding  
   跨越地图  方法
   this.gaodeMarker.on('dragend', e => {
      this.markerDragHandler({ lat: e.target._lngLat.lat.toFixed(6), lng: e.target._lngLat.lng.toFixed(6) })
    }) 
3.  vms.oildepot.branch.save : longitude ,latitude



维修申请-维修报价 
1. vms.maintaince.maintainceSupplier.getGeoCoder   lng, lat

尿素管理-尿素站

1. map.bsm.position.bsmFindPosition
  item.location.lng
  item.location.lat

2. 跨越地图  方法
  kyemap.mapservice.reverseGeocoding
  on('dragend', e => {
    e.target._lngLat.lat.toFixed(6), lng: e.target._lngLat.lng.toFixed(6)
  }
  vms.oildepot.ureaWarehouse.update 
  vms.oildepot.ureaWarehouse.save


事故管理  后端处理的



跨声- 临时任务  
1. baseconfig.node.searchByName

var local = new BMap.LocalSearch(this.$map, {
        onSearchComplete: (res) => {
          if (local.getStatus() === BMAP_STATUS_SUCCESS) {
            var pointList = res.Br || res.Ar || []
            this.networkList = pointList.map(e => {
              return {...e, name: `${e.title}(${e.address})`, id: e.uid, latitude: e.point.lat, longitude: e.point.lng}
            })
            console.log(this.networkList)
          }
          this.loading = false
        } 
      })

2. vms.tempTask.addFromH5   用到
latitude: e.point.lat, longitude: e.point.lng   


