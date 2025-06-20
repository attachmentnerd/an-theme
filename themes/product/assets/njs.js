
//console.log('browse_demos')

class Demos{

    constructor(){
        this.events()
        this.populateBrowseDemosImages(0,18, false)
        if(PAGE == HOMEPAGE || PAGE == 'post'){
            $('.browse_layout').attr('style', 'display: flex !important;')
        }
        this.scroll_to_last_first_time = true
        this.populateBrowseCompleted = false
        this.selected_demo = 'Discovery 1'
    }

    events() { 
        $('body').on('click', '.layout_bar_middle img', (e) => {
            var t = e.currentTarget
            if(PAGE == HOMEPAGE){
                DEMO.sidebars = $(t).attr('demo')
                ROUTER.setUrl()
                SIDEBARS.updateSidebars()
            } else if(PAGE == 'post'){
                DEMO.postSettings = $(t).attr('demo')
                DEMO.contentTopPadding = $(thtis).attr('tp')
                ROUTER.setUrl()
                POST.updatePostSettings()
            }
        })
        
        $('body').on('click','.topbar_demos_bar_middle img',(e) => {
            var t = e.currentTarget

            if ( $(t).attr('name') == 'post_page'){
                PAGE = 'post'
                let redirect_url = ROUTER.setUrl(true)
                window.location.href =  redirect_url
                return
            }

            this.selected_demo = $(t).attr('name')
     
            if(IsR2){
                document.cookie = 'bap_last_saved_demo='+$(t).attr('name')  +';  path=/';
                document.cookie = 'bap_last_selected_demo='+$(t).attr('data-id') +';  path=/';
            }
            TOPBAR.changed('demo')
            this.loadDemo($(t).attr('demo'))
        })
    }

    populateBrowseDemosImages(offset,limit, from_click = false){
        if(from_click){
            $('.topbar_demos_bar_middle').html('')
        }
        var filteredDemoPresets = this.filterPresets()
        //console.log(filteredDemoPresets)
        if (this.populateBrowseCompleted){ return }
        var st = ''
        var i = 1
        //var imgPath = 'https://r3.robust-themes.com/products/images/'
        //var imgPath = 'images/'
        var imgPath = 'https:///s3.robust-themes.com/products/images/'
        for (var demo of filteredDemoPresets){
            i++
            if (i < offset) { continue }
            let img = imgPath + demo[2]
            st += '<img  class="swiper-slide" demo-type="'+ demo[4]+'" demo-variant="'+ demo[3]+'" name="'+ demo[0]+'" data-id="'+i+'" demo="'+ demo[1]+'" src="'+img+'"/>\n'
            if (i > limit) { break }
            if (i == DEMO_PRESETS.length-1 ){ this.populateBrowseCompleted = true }
        }
        //console.log(i)
        $('.topbar_demos_bar_middle').append(st)
    }

    filterPresets(){
        var filters = []
        $('.demos-filter input').each(function(){
            var obj = {}
            var type =$(this).data('type')
            var value = $(this).attr('value')
            var arr = 4
            if(type == "demo-variant"){
                arr = 3
            }
            if(!$(this).is(":checked")){
                obj["name"] = value
                obj['arr'] = arr
                filters.push(obj)
            }
            
        })

        var filteredDemoPresets = []
        for(var demo of DEMO_PRESETS){
            var showThisDemo = true
            if(filters.length){
                for(var filter of filters){
                    if(demo[filter.arr] == filter.name){
                        showThisDemo = false
                    }
                }
            }
            if(showThisDemo){
                filteredDemoPresets.push(demo)
            }
        }
        return filteredDemoPresets
    }
    loadDemo(val){
        var newUrl = '/products/?' + val
        ROUTER.url2demo(newUrl)
        if(IsR2){
            if (PAGE != HOMEPAGE){
                window.location.href = newUrl
            } else {
                history.pushState('', '', newUrl )
                ROUTER.loadUrl()
            }
        }
        ROUTER.loadUrl()
        $('.clmn_show_grids-true').removeClass('clmn_show_grids-true').addClass('clmn_show_grids-false')
    }

}











//console.log('build_settingsData')

MJSON_ORG = {}
MJSON = {}
JTB_overwriteInit = {}

class Build{

    constructor(){
        this.getMJSON()
        this.events()
    }

    getMJSON(){
        var url = 'https://dev.robust-themes.com/njs/master_json.json?v=1.4'
        if (!isR2){
            url = ASSETS_PATH+'master_json.js?v=1.4'
        }
        $.getJSON(url,function (data) {
            MJSON_ORG = data
        }) 
    }

    events(){
        $('.bap_build_json').click(function (){
            ROUTER.loadUrl()
            BUILD.bapBuildClicked()
        })
    }

    bapBuildClicked(){
        // JTB_overwrite.setStaticSections["post_completion"] = "completion_message"
        MJSON = JSON.parse(JSON.stringify(MJSON_ORG));
        JTB_overwriteInit =   JSON.parse(JSON.stringify(JTB_overwrite))
        //console.log(JTB_overwrite)
        let newTheme = this.prepareThemeJson(JTB_baseThemeName,JTB_overwriteInit)
        var settingsData = this.BAPbuild(newTheme)
        //console.log(settingsData)
        return settingsData
    
        
    }
    
    prepareThemeJson(baseThemeName,overwrite){
        var themeRoot =  MJSON.themes[baseThemeName];

        // setStaticSections
        if (overwrite.setStaticSections != undefined){
            for (var key of Object.keys(overwrite.setStaticSections)){
                themeRoot.current.sections[key].name = overwrite.setStaticSections[key]
            }
        }
    
        for (var dPage of ['dashboard','post','categories','category','search']){
    
            if (dPage == 'post'){
                // PAGE = 'post'
                // //console.log(PAGE)
                // POST.updatePostSettings()
                var dynamicArea = 'content_for_post'
                var dynSections =  POST.postPageSections()
            } else {
                if (dPage == 'dashboard'){
                    var dynamicArea = 'content_for_index'
                    var defaults = 'vb1-lwid1-cl1-da2'
                    var sectionsCodes =  ROUTER.urlParm('ds')
                }
                if (dPage == 'categories'){
                    var dynamicArea = 'content_for_categories'
                    var defaults = 'clh-cl5'
                    var sectionsCodes =  ROUTER.urlParm('cl')
                }
                if (dPage == 'category'){
                    var dynamicArea = 'content_for_category'
                    var defaults = 'csh-cs1'
                    var sectionsCodes =  ROUTER.urlParm('cs')
                }
                if (dPage == 'search'){
                    var dynamicArea = 'content_for_search'
                    var defaults = 'lsh-lf1'
                    var sectionsCodes =  ROUTER.urlParm('sh')
                }
                if(dPage == "announcments"){
                    var dynamicArea = 'content_for_announcements'
                    var defaults = 'a1-a3'
                    var sectionsCodes =  ROUTER.urlParm('an')
                }
                if (!(sectionsCodes)){
                    sectionsCodes = defaults
                }
                //console.log(dynSections)
                dynSections = []
                for (var code of sectionsCodes.split('-')){
                    var section_name = UCODE.code2sections[code]

                    if (dPage == 'search'){
                        if (section_name.includes('lesson_search') ||  section_name.includes('lesson_filters_')){
                            section_name = section_name + '_static'
                        }
                    }

                    dynSections.push(section_name)
                }
            }
    
    
    
            overwrite[dynamicArea] = dynSections
    
            for (var i in overwrite[dynamicArea]){
                if (!(JTB_playlistIsBlock) && overwrite[dynamicArea][i].includes('playlist') && !overwrite[dynamicArea][i].includes('playlist_horizontal_bg')){
                    overwrite[dynamicArea][i] = JTB_playlistName
                }   
            }
        
            LAYOUT.JTB_append(JTB_ProgressOverwrites,overwrite)
            LAYOUT.JTB_append(JTB_BadgeOverwrites,overwrite)
    
    
            themeRoot.current[dynamicArea] = overwrite[dynamicArea]
            for (var section of overwrite[dynamicArea]){
                if (themeRoot.current.sections[section] == undefined){
                    themeRoot.current.sections[section] = {}
                }
            }
        }
    
    
        themeRoot.current.sections.p_header.name = JTB_headerName
        themeRoot.current.sections.p_header.overwrite = JTB_headerOverwrites
    
        for (var sectionName of Object.keys(overwrite.sections)){
            if (["p_header","p_main_sidebar","p_secondary_sidebar", "p_badges"].includes(sectionName)){
                themeRoot.current.sections[sectionName].overwrite =  overwrite.sections[sectionName]
            } else {
                let sectionNameReplaced = sectionName.replace('|','__')
                themeRoot.current.sections[sectionNameReplaced] =  overwrite.sections[sectionName]
            } 
        }
    
        if (overwrite.theme_settings != undefined){
            themeRoot.current.theme_settings.overwrite = overwrite.theme_settings
        }
    
        themeRoot.current.theme_settings.overwrite = this.buildSetColors(themeRoot.current.theme_settings.overwrite)
        
        return themeRoot;
    }
    
    buildSetColors(themeSettings){
        if (ROUTER.urlParm('clr')){
            let colors = ROUTER.urlParm('clr').split('-')
            themeSettings.accent_color_1 = '#' + colors[0]
            themeSettings.accent_color_2 = '#' + colors[1]
            themeSettings.color_bg_1 = '#' + colors[2]
            themeSettings.color_bg_2 = '#' + colors[3]
        } else {
            themeSettings.accent_color_1 = '#005ffe' 
            themeSettings.accent_color_2 = '#fadc4a' 
            themeSettings.color_bg_1 = '#f4f5fc    '
            themeSettings.color_bg_2 = '#f4f6f9'     
        }
        if (ROUTER.urlParm('cm') == 'd'){
            themeSettings.color_primary = '#ededed' 
            themeSettings.text_color_2 = '#ffffff'
        }
        else{
            themeSettings.color_primary = '#000000' 
            themeSettings.text_color_2 = '#777777'
        }
        return themeSettings
    }
    
    BAPbuild(themeRoot){
    
        //  insert theme settings
        let settingFileName = themeRoot.current.theme_settings.name
        var settingFile = MJSON.themes_settings[settingFileName];
    
        let attrs = themeRoot.current.theme_settings.overwrite
        settingFile = this.overwriteAttrs(settingFile,attrs,'settings')
        
        settingFile = this.overwriteButtons(settingFile)
    
        for (var attrName of Object.keys(settingFile)){
            themeRoot.current[attrName] = settingFile[attrName]
        }
    
        themeRoot.current.color_mode = COLORS.JTB_colorMode
        delete themeRoot.current.theme_settings
    
    
        // insert sections
        var sections = themeRoot.current.sections
        for (var sectionName of Object.keys(sections)){
            if (sectionName == 'undefined') { continue; }
            if (["p_header","p_main_sidebar","p_secondary_sidebar", "p_badges"].includes(sectionName)){
               var sectionData = this.buildSection(sections[sectionName].name,sections[sectionName].overwrite)
                sections[sectionName] = sectionData
            } else {
                var sectionData = this.buildSection(sectionName,sections[sectionName])  
                var sectionNameRi = sectionName.split('|')
                var suffixedName = sectionNameRi[0]
                if (sectionNameRi.length > 1){
                    suffixedName = sectionName.replace('|','__')
                    delete sections[sectionName]
                }  

                if (suffixedName.includes('lesson_search') ||  suffixedName.includes('lesson_filters_')){
                   // let sname = suffixedName + '_static' 
                   // sections[sname] = sectionData
                   // sections[sname].id = sname
                } 

                sections[suffixedName] = sectionData
            }
        }
    
        themeRoot = this.blockIdsToIntegers(themeRoot)
        
        var themeRootStr = JSON.stringify(themeRoot, null)
        return  themeRootStr;
        
    }
    
    buildSection(sectionName,themeLevelOverwrites){
        MJSON = JSON.parse(JSON.stringify(MJSON_ORG));
    
        var sectionNameRi = sectionName.split('__')
        var sectionNameWithoutSuffix = sectionNameRi[0]
        var sectionNameHasSuffix = false
        if (sectionNameRi.length > 1){
            sectionNameHasSuffix = true
            sectionNameSuffix = sectionNameRi[1]
        }

        let section_id = sectionNameWithoutSuffix
        if (sectionNameWithoutSuffix.includes('lesson_search') ||  sectionNameWithoutSuffix.includes('lesson_filters_')){
            sectionNameWithoutSuffix = sectionNameWithoutSuffix.replace('_static','')
        } 
        
        var sectionRoot = MJSON.sections[sectionNameWithoutSuffix];
        sectionRoot.id = section_id
    
        sectionRoot = this.overwriteThemeLevel(sectionRoot,themeLevelOverwrites)
    
    
        // insert settings
        let settingsFileName = Object.keys(sectionRoot.settings)[0]
    
        let settingsFile = MJSON.sections_settings[settingsFileName]
        var attrs = sectionRoot.settings[settingsFileName]
        settingsFile = this.overwriteAttrs(settingsFile,attrs,'settings')
        
        sectionRoot.settings = settingsFile
    
        // insert blocks
        var blockOrder  = []
        for (var blockName of Object.keys(sectionRoot.blocks)){
            if (blockName.includes('outline')){
                if (JTB_outlineName == 'Hide'){ continue }
                blockName = JTB_outlineName
                attrs = JTB_outlineOverwrites
            } else if (blockName.includes('playlist') && JTB_playlistIsBlock && !blockName.includes('horizontal_bar') ){
                if (JTB_playlistName == 'playlist_none'){ continue }
                blockName = JTB_playlistName
                attrs = JTB_playlistOverwrites
            } else {
                attrs = sectionRoot.blocks[blockName]
            }
            let blockFile = MJSON.blocks[blockName]
            
            try{
                blockFile.block = this.overwriteAttrs(blockFile.block,attrs,'block')
            } catch (e) {
                if (e instanceof TypeError ){
                    alert('issue with block: ' + blockName + '\n' + 'check JTB_playlistIsBlock settings')
                }
            }
            if (sectionNameHasSuffix){
                blockName = blockName +'__'+sectionNameSuffix
            }
            sectionRoot.blocks[blockName] = blockFile.block
            sectionRoot = this.modifySectionClmnSettings(sectionRoot,blockFile.clmn,attrs.clmn)
            
            blockOrder.push(blockName)     
        }
        sectionRoot.block_order = blockOrder
        return sectionRoot;
    
    
    }
    
    overwriteThemeLevel(obj,attrs){
        for (var attrId of Object.keys(attrs)){
            try{
                if (attrId.includes('remove_block')){
                    delete obj.blocks[attrs[attrId]]
                }
                if (attrId.includes('add_block')){
                    obj = this.addBlock(obj,attrs,attrId)
                }
                var attrIdRi =  attrId.split('.')
                if (attrIdRi[0] != 'settings' && attrIdRi[0] != 'blocks'  && !(attrIdRi[0].includes('remove_block')) && !(attrIdRi[0].includes('add_block'))){
                    console.warn('Theme level overwrites must begin with wither settings.* or blocks.* or remove_block')
                }
                if (attrIdRi[0] == 'blocks'){
                obj.blocks[attrIdRi[1]][attrIdRi[2]] = attrs[attrId]
                }
                if (attrIdRi[0] == 'settings'){
                    if (attrIdRi[1] == 'padding_desktop' || attrIdRi[1] == 'padding_mobile'){
                        attrIdRi[1] += '.'+attrIdRi[2]
                    }
                    obj.settings[Object.keys(obj.settings)[0]][attrIdRi[1]] = attrs[attrId]
                }
            }catch{}
        }

        return obj
    }
    
    addBlock(obj,attrs,attrId){
        try{
            let r1 = attrs[attrId].split('|')
            let r2 = r1[0].split(':')
            var beforeOrAfter = r2[0]
            var refBlock = r2[1]
            var blockToAdd = r1[1]
        
            var temp = {};
            var i = 1;
            for (var prop in obj.blocks) {
                if (i == refBlock && beforeOrAfter == 'index') {
                    temp[blockToAdd] = obj.blocks[prop];
                }
                if (prop == refBlock && beforeOrAfter == 'before') {
                    temp[blockToAdd] = obj.blocks[prop];
                }
                temp[prop] =Object.assign({}, obj.blocks[prop]); 
    
                if (prop == refBlock && beforeOrAfter == 'after') {
                    temp[blockToAdd] = obj.blocks[prop];
                }
                i++
            }
           
            obj.blocks = temp;
            return obj
        } catch (e) {
           alert('Error with ADD_BLOCK - required syntex: "add_block":"after:refferance_block|block_to_add"  ')   
        }
    }
    
    overwriteAttrs(obj,attrs,type1){
        for (var attrId of Object.keys(attrs)){
            var actualAttrId = attrId.split('|')[0]
    
            if(attrId.includes('padding_desktop') || attrId.includes('padding_mobile')){
                let r = attrId.split('.')
                obj[r[0]][r[1]] = attrs[attrId]  
                return obj
            }
    
            if (attrId == 'name' || type1 == 'settings' || attrId == 'hidden'){
                var initVal = obj[actualAttrId]
            } else {
                var initVal = obj.settings[actualAttrId]
            }
    
            if (attrs[attrId].includes('append|')){
                var newVal = initVal + attrs[attrId].replace('append|','') 
            } else if (attrs[attrId].includes('prepend|')){ 
                var newVal = attrs[attrId].replace('prepend|','') + initVal
            } else if (attrs[attrId].includes('replace|')){ 
                let r = attrs[attrId].replace('replace|','').split(',')
                if (r.length == 1){ alert('use of replace| must include 2 values seprated by comma') }
                var newVal = initVal.replace('replace|','').replace(r[0],r[1])
            } else {
                var newVal = attrs[attrId]  
            }
    
            if (attrId == 'name' || type1 == 'settings' || attrId == 'hidden'){
               obj[actualAttrId] = newVal
            } else {
               obj.settings[actualAttrId] = newVal
            }
           
        }
        return obj
    }
    
    modifySectionClmnSettings(sectionRoot,clmnSettings,newClmn){
        if (clmnSettings == undefined){ return sectionRoot; }
        
        for (var clmn_attr of Object.keys(clmnSettings)){
            sectionRoot.settings[clmn_attr+'_'+newClmn] = clmnSettings[clmn_attr]
        }
        return sectionRoot
    }
    
    
     blockIdsToIntegers(conf){
       var sectionsJ = conf.current.sections
       for (var section_name of Object.keys(sectionsJ)){
           for (var i in sectionsJ[section_name].block_order){
               var oldKey = sectionsJ[section_name].block_order[i]
               var newKey = this.getRandomId()
               sectionsJ[section_name].block_order[i] = newKey.toString()
               let o = sectionsJ[section_name].blocks
               delete Object.assign(o, {[newKey]: o[oldKey] })[oldKey];
           }
           
       }
       return conf
    }
    
    getRandomId(){
       return  99999999999 + Math.floor(Math.random() * 99999999999);
    }
    
    overwriteButtons(settingFile){
        if (ROUTER.urlParm('b')){
            var btns = 'btn_' + ROUTER.urlParm('b')
        }  else {
            var btns = 'btn_d1'
        }
        var bjson = MJSON_ORG.sections[btns]
        for (var item of bjson){
            let key = item.id.replace('settings_','') 
            settingFile[key] = item.val
        }
        return settingFile 
    }
}



DEMO_PRESETS = [
  
  ['Discovery 1','p=d&clr=005ffe-fadc4a-F4F5FC-FFFFFF&cm=&sb=MSt-MPl-SSt-SFr-SPr-OTd1-OSf-PBh-PSs&ds=vb1-lwid1-cl1-da2&hd=d1&hp=&tp=&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&cl=clh-cl5&cs=csh-cs1&b=&mf=','discovery-1.jpg', 'light-demo', 'journey'],
  ['Discovery 4','p=d&clr=808861-FFFA77-090613-242937&cm=d&sb=MSt-MPl-SSt-SFr-SPr-OTdo-OSf-PBcp-PSm&ds=vb1-lwid1-cl1-da2&hd=c1&hp=&tp=0&bg=&ps=HMf-SMt-APr-RFf-PLl-PId-HBf-MPl-SPr&cl=clh-cl2&cs=csh-cs1&b=c3&mf=&oc=ab','discovery-4.jpg', 'dark-demo', 'journey'],
  ['Curiosity 3','p=d&clr=94769A-D78597-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hrc3-lc3-cs4-da2&hd=d1&hp=&tp=50&cw=1366&dev=CCt&bg=&ps=HMf-SMt-APh-RFf-PLn-PId-HBf-MPl-SPl&cl=clh-cl1&cs=csh-cs1&b=c3&mf=sia','curiosity-3.jpg', 'light-demo', 'journey'],
  
  ['Curiosity Alpha','p=d&clr=3F3845-89A6FF-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBcp-PSs&ds=bch-d1f-a3-ple&hd=c3&hp=&tp=30&cw=1350&bg=&ps=HMf-SMt-APr-RFf-PLl-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=&mf=mrtp&oc=ab','curiosity-alpha.jpg', 'light-demo', 'journey'],
  ['post_page','p=d&clr=F47656-F47656-ffffff-F7CD7E&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=150&dev=CCt&bg=nrn&ps=HMt-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=tob&oc=ab','customize_post_demos.jpg', 'light-demo', 'journey'],
  
  ['memebrship_light_3','p=d&clr=94769A-D78597-F4F5FC-FFFFFF&cm=l&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hrc3-l3d-l2d-l1d-l5d-l4d&hd=c1&tp=50&pp=0&cw=1500&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=mrtp-hc3r&snb=sd1','memebrship_light_3.webp', 'light-demo', 'membership'],
 
  ['Curiosity 1','p=d&clr=005ffe-FFD426-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-cl1&hd=c1&hp=&tp=50&cw=1366&bg=&ps=HMf-SMt-APr-RFf-PLd-PIa2-HBt-MPl-SPl&cl=clh-cl1&cs=csh-cs1&b=&mf=&oc=ab','curiosity-1.jpg', 'light-demo', 'journey'],
  ['memebrship_dark_4','p=d&clr=94769A-D78597-141313-1F1F1F&cm=d&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hrc3-l3d-l2d-l1d-l5d-l4d&hd=c1&tp=50&cw=1500&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=mrtp-hc3r&snb=sd1','memebrship_dark_4.webp', 'dark-demo', 'membership'],
  ['Evolution Doctor','p=d&clr=5669FF-FF7272-FFFFFF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTd4-OSf-PBcl-PSs&ds=hre-lc31-lbe-lc3&hd=hc&hp=&tp=150&cw=1366&dev=CCt&bg=hlt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-doctor.jpg', 'light-demo', 'journey'],
 
  ['Discovery Curious','p=d&clr=EE4C7D-EE4C7D-141313-1F1F1F&cm=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd4-l1d-l2d-da2&hd=d1&hp=&tp=&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&cl=clh-cl2&cs=csh-cs1&b=d1&mf=chb-sabw','discovery-curious.jpg', 'dark-demo', 'journey'],
 
  ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&hp=&tp=60&cw=1366&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&cl=clh-cl1&cs=csh-cs1&b=&mf=&oc=ab','curiosity-2.jpg', 'light-demo', 'journey'],
  ['Discovery 8','p=d&clr=f21a1a-A4CBFF-fefefe-f4f6fb&cm=&sb=MSt-MPl-SSt-SFr-SPr-OTd6-OSf-PBh-PSs&ds=hrc4-cl4-a3&hd=d1&hp=&tp=&bg=&ps=HMf-SMt-APr-RFf-PLn-PId-HBt-MPl-SPr&cl=clh-cl5&cs=csh-cs1&b=c3&mf=&oc=ab','discovery-8.jpg', 'light-demo', 'journey'],
  ['Curiosity Emerald','p=d&clr=1F4958-CADCFF-ffffff-ecf0f1&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd6-OSf-PBnal-PSs&ds=hrd4-lwid1-da2&hd=hc&hp=&tp=50&cw=1366&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=&mf=&oc=ab','curiosity-emerald.jpg', 'light-demo', 'journey'],
  ['Discovery 7','p=d&clr=FF8906-AFAFAF-141313-1F1F1F&cm=d&sb=MSt-MPl-SSf-SFr-SPr-OTd4-OSf-PBh-PSs&ds=hrc4-cl4-a3&hd=dl&hp=&tp=20&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&cl=clh-cl2&cs=csh-cs1&b=c3&mf=','discovery-7.jpg', 'dark-demo', 'journey'],
  ['memebrship_light_1','p=d&clr=3F3845-89A6FF-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBcp-PSs&ds=bch-l2d-l3d-l1d-l5d-l4d-l1d&hd=c3&tp=30&pp=0&cw=1500&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=mrtp&snb=sd1','memebrship_light_1.webp', 'light-demo', 'membership'],
 
    ['Evolution Cooking 2','p=d&clr=F47656-F47656-ffffff-FFF9ED&cm=l&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&tp=220&cw=1366&pp=165&dev=CCt&bg=nrn&ps=HMt-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&pt=pb-pc-cd-pq-pn&pl=pm-pt-pb-pc-cd-pq-pn-pr&ts=c&cl=clh-cl4&cs=csh-cs1&sh=lsh-lf1&mf=tob&oc=ab','evolution-cooking-2.jpg', 'light-demo', 'journey'],
     ['memebrship_light_2','p=d&clr=4C577C-C0CBED-F4F5FC-FFFFFF&cm=l&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hc2-l3d-l2d-l1d-l5d-l4d&hd=dl&tp=100&cw=1500&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=hc3r&snb=sd1','memebrship_light_2.webp', 'light-demo', 'membership'],
 
    ['Discovery 2','p=d&clr=07314C-FFE0E0-ffffff-fefefe&cm=&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id2-ld2-da2&hd=d1&hp=&tp=&bg=&ps=HMt-SMt-APh-RFf-PLn-PId-HBf-MPl-SPr&cl=clh-cl2&cs=csh-cs1&b=c3&mf=&oc=ab','discovery-2.jpg', 'light-demo', 'journey'],
 
 
  ['Evolution Makeup','p=d&clr=DB588F-E5CBD3-ffffff-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=100&dev=CCt&bg=mkp&ps=HMf-SMt-APr-RFf-PLl-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-makeup.jpg', 'light-demo', 'journey'],

   ['Evolution Education','p=d&clr=245D51-8ED3D5-ffffff-EAEFEF&cm=&sb=MSf-MPl-SSt-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=120&dev=CCt&bg=edc&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-education.jpg', 'light-demo', 'journey'],

   ['Evolution Stock','p=d&clr=00ADFF-F47656-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hrd4-vid-cl3&hd=hc&hp=&tp=150&cw=1366&dev=CCt&bg=stk&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl4&cs=csh-cs1&b=&mf=tob-chb&oc=ab','evolution-stock.jpg', 'dark-demo', 'journey'],

   ['Evolution Photography','p=d&clr=FE3C92-F47656-1F282D-292F35&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=hc&hp=&tp=150&dev=CCt&bg=pht&ps=HMt-SMt-APb-RFf-PLh-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=tob&oc=ab','evolution-photography.jpg', 'dark-demo', 'membership'],
 
   ['Discovery Dark','p=d&clr=FF8ACD-DDB8CD-141313-1F1F1F&cm=d&sb=MSt-MPl-SSt-SFr-SPr-OTc1-OSf-PBcl-PSm&ds=hre-upd-da2&hd=d1&hp=&tp=&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&cl=clh-cl5&cs=csh-cs1&b=&mf=mbca&oc=ab','discovery-dark.jpg', 'dark-demo', 'journey'],
  ['Evolution Painting','p=d&clr=395F8B-0A58B3-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=vb1-l1d-l2d-l3d-l5d&hd=ab&hp=&tp=150&cw=1366&dev=CCt&bg=pnt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=hvml&oc=ab','evolution-painting.jpg', 'light-demo', 'journey'],
  ['memebrship_dark_1','p=d&clr=2980b9-B3E1FF-141313-1F1F1F&cm=d&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hrd4-ld4-ld41-l5d-ld4&tp=350&cw=1600&pp=0&dev=CCt&bg=pht&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&snb=sd1','memebrship_dark_1.webp', 'dark-demo', 'membership'],
 
 
 
  ['Curiosity Yoga','p=d&clr=808861-7C7CA1-FFFFFF-FBF1EB&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTmi-OSf-PBh-PSs&ds=vrh-lc3-lwid1-cl1-da2&hd=c1&hp=&cw=1366&tp=50&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLh-PIwb-HBt-MPl-SPl&cl=clh-cl1&cs=csh-cs1&b=&mf=mrtp','curiosity-yoga.jpg', 'light-demo', 'journey'],
  ['Evolution Cooking','p=d&clr=4D3355-DA2343-FFFFFF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTib-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=150&cw=1366&dev=CCt&bg=ckg&ps=HMf-SMt-APb-RFf-PLh-PIa1-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-cooking.jpg', 'light-demo', 'journey'],

  ['Discovery 5','p=d&clr=929292-FFFA77-141313-1F1F1F&cm=d&sb=MSt-MPl-SSt-SFr-SPr-OTd5-OSf-PBcl-PSm&ds=hrd3-cl1-da2&hd=dl&hp=&tp=20&bg=&ps=HMf-SMt-APr-RFf-PLl-PIa1-HBt-MPl-SPr&cl=clh-cl5&cs=csh-cs1&b=&mf=&oc=ab','discovery-5.jpg', 'dark-demo', 'journey'],
 
  ['Discovery Beige','p=d&clr=001858-F582AE-F2E9D7-FEF6E4&cm=&sb=MSf-MPl-SSt-SFr-SPr-OTd1-OSf-PBh-PSs&ds=osd-d1f-a3&hd=hc&hp=&tp=30&cw=1366&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&cl=clh-cl5&cs=csh-cs1&b=&mf=mrtp&oc=ab','discovery-beige.jpg', 'light-demo', 'journey'],
  ['Curiosity Dark','p=d&clr=005ffe-72719A-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTib-OSf-PBcl-PSs&ds=lwid1-cl1-da2&hd=c2&hp=&tp=50&cw=1366&dev=CCt&bg=&ps=HMf-SMt-APh-RFf-PLn-PId-HBf-MPl-SPl&cl=clh-cl1&cs=csh-cs1&b=&mf=mrtp-adb','curiosity-dark.jpg', 'dark-demo', 'journey'],
 
   ['Curiosity Rome','p=d&clr=808861-DBF184-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTdo-OSf-PBh-PSs&ds=hrr-lc3&hd=c1&hp=&tp=50&cw=1366&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl1&cs=csh-cs1&b=&mf=','curiosity-rome.jpg', 'light-demo', 'journey'],
   ['memebrship_light_8','p=d&clr=5669FF-FF7272-FFFFFF-FFFFFF&cm=l&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&tp=30&cw=1366&pp=165&dev=CCt&bg=hlt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPr&pt=pb-pc-cd-pq-pn&pl=pm-pt-pb-pc-cd-pq-pn-pr&ts=c&cl=clh-cl4&cs=csh-cs1&sh=lsh-lf1&oc=ab','memebrship_light_8.webp', 'light-demo', 'membership'],

  ['Curiosity Check','p=d&clr=005ffe-fadc4a-141313-0C0C0C&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTib-OSf-PBcl-PSs&ds=prh-ld2-lwid1-cl1-da2&hd=c3&hp=&tp=50&cw=1366&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl1&cs=csh-cs1&b=&mf=mrtp','curiosity-check.jpg', 'dark-demo', 'journey'],
  ['memebrship_dark_2','p=d&clr=F8A746-DCCB54-03101D-051626&cm=d&sb=MSf-MPl-SSt-SFr-SPr-OTe2-OSf-PBh-PSs&ds=hrd4-ld4-ld41-l5d-ld4&tp=30&cw=1700&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=hc3r-chb&snb=sv1','memebrship_dark_2.webp', 'dark-demo', 'membership'],
 
  ['Discovery 6','p=d&clr=007fff-6c6f85-141313-1F1F1F&cm=d&sb=MSt-MPl-SSf-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id3-cl6-a3&hd=dl&hp=&tp=20&bg=&ps=HMf-SMt-APb-RFf-PLh-PIwb-HBt-MPl-SPr&cl=clh-cl5&cs=csh-cs1&b=c3&mf=','discovery-6.jpg', 'dark-demo', 'journey'],
   
  ['Evolution Trading','p=d&clr=0F0FBB-F47656-0F0FBB-FFFFFF&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=150&cw=1366&dev=CCt&bg=stk&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl4&cs=csh-cs1&b=ct&mf=&oc=ab','evolution-trading.jpg', 'light-demo', 'journey'],
  ['memebrship_light_6','p=d&clr=2980b9-B3E1FF-ffffff-fefefe&cm=l&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hrd4-ld4-ld41-l5d-ld4&tp=50&pp=0&cw=1500&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=hc3r-chb&snb=sd1','memebrship_light_6.webp', 'light-demo', 'membership'],
 
  ['Evolution Write','p=d&clr=003181-1D0009-1B1528-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBcl-PSs&ds=hrd2-cl4&hd=c2&hp=&tp=&dev=CCt&cw=1366&bg=bus2&ps=HMf-SMt-APb-RFf-PLh-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=&mf=tob','evolution-write.jpg', 'dark-demo', 'journey'],
  ['Curiosity 4','p=d&clr=fe2942-f0d0bd-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTdo-OSf-PBh-PSs&ds=hrc4-cl4-a3&hd=c1&hp=&tp=50&cw=1366&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=c3&mf=','curiosity-4.jpg', 'dark-demo', 'journey'],
  ['Discovery 9','p=d&clr=3F3845-89A6FF-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFr-SPl-OTd1-OSf-PBh-PSs&ds=tad-d1f-a3&hd=hc&hp=&tp=30&cw=1366&bg=&ps=HMf-SMt-APh-RFf-PLn-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=&mf=&oc=ab','discovery-9.jpg', 'light-demo', 'journey'],
  ['Evolution Education 2','p=d&clr=2980b9-3498db-ffffff-fefefe&cm=l&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hrc4-cl4-a3&hd=hc&hp=&tp=100&cw=1366&dev=CCt&bg=edc&ps=HMf-SMt-APb-RFf-PLh-PIa1-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-education-2.jpg', 'light-demo', 'journey'],
  ['memebrship_light_4','p=d&clr=395F8B-FFFFFF-E8E8E9-ecf0f1&cm=l&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hrd3-l3d-l2d-l1d-l5d-l4d&tp=20&cw=1500&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=hc3r&snb=sd1','memebrship_light_4.webp', 'light-demo', 'membership'],
 
  ['Curiosity Athens','p=d&clr=3F3845-89A6FF-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBc-PSs&ds=oxh-d1f-a3&hd=c3&hp=&tp=30&cw=1366&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=&mf=ftb&oc=ab','curiosity-athens.jpg', 'light-demo', 'journey'],
  ['Evolution Yoga','p=d&clr=C34889-FE4042-403E3C-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTbr-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=230&cw=1366&dev=CCt&bg=yg1&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-yoga.jpg', 'light-demo', 'journey'],

  ['Discovery Paris','p=d&clr=2980b9-3498db-ffffff-fefefe&cm=&sb=MSt-MPl-SSf-SFr-SPl-OTd7-OSf-PBh-PSs&ds=psh-cl6-a3&hd=c1&hp=&tp=0&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=&mf=&oc=ab','discovery-paris.jpg', 'light-demo', 'journey'],
  ['Evolution Health','p=d&clr=18071D-DA2343-FFFFFF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTib-OSf-PBh-PSs&ds=hrd4-vid-cl3&hd=hc&hp=&tp=70&cw=1366&dev=CCt&bg=hlt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-health.jpg', 'light-demo', 'journey'],

  ['Discovery 10','p=d&clr=2980b9-3498db-F4F5FC-FFFFFF&cm=l&sb=MSt-MPl-SSf-SFr-SPl-OTd5-OSf-PBnal-PSm&ds=lyf-cl6-a3&hd=ab&hp=&tp=0&bg=&ps=HMf-SMt-APr-RFf-PLl-PId-HBf-MPl-SPl&cl=clh-cl2&cs=csh-cs1&b=c3&mf=&oc=ab','discovery-10.jpg', 'light-demo', 'journey'],
  ['Evolution Makeup 2','p=d&clr=DB588F-E5CBD3-ffffff-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&hp=&tp=100&cw=1366&dev=CCt&bg=mkp&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-makeup-2.jpg', 'light-demo', 'journey'],
  ['Discovery 3','p=d&clr=F8A746-FFFA77-03101D-051320&cm=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSt-PBh-PSs&ds=hrd3-l1d-l2d-l3d-bd3-l4d-l5d&hd=d1&hp=&tp=&bg=&ps=HMf-SMt-APr-RFf-PLh-PId-HBf-MPl-SPr&cl=clh-cl5&cs=csh-cs1&b=&mf=cbc&oc=ab','discovery-3.jpg', 'dark-demo', 'membership'],
  ['memebrship_dark_5','p=d&clr=005ffe-526B99-141313-0C0C0C&cm=d&sb=MSf-MPr-SSf-SFr-SPl-OTe2-OSf-PBh-PSs&ds=hc2-l3d-l2d-l1d-l5d-l4d&hd=dl&tp=100&cw=1500&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=hc3r&snb=sd1','memebrship_dark_5.webp', 'dark-demo', 'membership'],

  ['Discovery 11','p=d&clr=ef6db6-8FD7FF-ffffff-f7f7f9&cm=l&sb=MSt-MPl-SSf-SFr-SPl-OTib-OSf-PBab-PSm&ds=mnd-cl6-a3&hd=ab&hp=&tp=0&bg=&ps=HMf-SMt-APr-RFf-PLh-PIwb-HBt-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=c3&mf=&oc=ab','discovery-11.jpg', 'light-demo', 'journey'],
  ['Evolution Photography 2','p=d&clr=003181-1D0009-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBcl-PSs&ds=hrd2-cl4&hd=c2&hp=t&tp=150&cw=1366&dev=CCt&bg=pht&ps=HMf-SMt-APb-RFf-PLh-PIa1-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=tob&oc=ab','evolution-photography-2.jpg', 'dark-demo', 'journey'],
  ['memebrship_light_10','p=d&clr=474954-5C92FF-FFFFFF-F4F4F4&cm=l&sb=MSf-MPl-SSt-SFr-SPr-OTe2-OSf-PBh-PSs&ds=hrd4-ld4-ld41-l5d-ld4&tp=30&cw=1700&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=hc3r-chb&snb=sv1','memebrship_light_10.webp', 'light-demo', 'membership'],
  ['Evolution Fitness','p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTdo-OSf-PBcp-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=fit&ps=HMf-SMt-APr-RFf-PLl-PId-HBf-MPl-SPr&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-fitness.jpg', 'dark-demo', 'membership'],
  
  ['Discovery 12','p=d&clr=874F6F-8FD7FF-F4F5FC-FFFFFF&cm=l&sb=MSt-MPl-SSf-SFr-SPl-OTd4-OSf-PBh-PSm&ds=vid-lc3&hd=d1&hp=&tp=0&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl5&cs=csh-cs1&b=&mf=&oc=ab','discovery-12.jpg', 'light-demo', 'journey'],
  ['memebrship_light_9','p=d&clr=3F3845-89A6FF-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPl-OTe2-OSf-PBh-PSs&ds=hrc3-l3d-l2d-l1d-l5d-l4d&hd=c1&tp=80&cw=1366&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=mrtp-hc3r&snb=sd1','memebrship_light_9.webp', 'light-demo', 'membership'],
 

  ['memebrship_light_7','p=d&clr=DB588F-E5CBD3-ffffff-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFr-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&tp=220&cw=1350&pp=165&dev=CCt&bg=mkp&ps=HMf-SMt-APr-RFf-PLl-PId-HBf-MPl-SPl&pt=pb-pc-cd-pq-pn&pl=pm-pt-pb-pc-cd-pq-pn-pr&ts=c&cl=clh-cl4&cs=csh-cs1&sh=lsh-lf1','memebrship_light_7.webp', 'light-demo', 'membership'],
 

  ['Evolution Business','p=d&clr=398789-8ED3D5-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd6-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=240&cw=1366&dev=CCt&bg=bus&ps=HMf-SMt-APb-RFf-PLh-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-business.jpg', 'light-demo', 'journey'],
  ['memebrship_dark_3','p=d&clr=808861-FFFA77-090613-242937&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBcp-PSs&ds=bch-l2d-l3d-l1d-l5d-l4d-l1d&hd=c3&tp=60&cw=1500&pp=0&dev=CCt&ps=HMf-SMt-APr-RFr-PLl-PId-HBf-MPl-SPl&pt=pb-cd-pn&pl=pm-pt-pb-cd-pn-pr&ts=n&cl=clh-cl5&cs=csh-cs1&sh=lsh-lf1&mf=mrtp&snb=sd1','memebrship_dark_3.webp', 'dark-demo', 'membership'],
 
 
  ['Evolution Business 2','p=d&clr=398789-8ED3D5-A2D8DF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&cw=1366&dev=CCt&bg=bus2&ps=HMf-SMt-APr-RFf-PLl-PId-HBf-MPl-SPr&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-business-2.jpg', 'light-demo', 'journey'],
  ['Evolution Golf','p=p&clr=3C7A17-639147-3C7A17-FFFFFF&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=200&cw=1366&dev=CCt&bg=glf&ps=HMf-SMt-APb-RFf-PLh-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=&oc=ab','evolution-golf.jpg', 'light-demo', 'journey'],
  ['Evolution Nature','p=d&clr=7acbe6-7acbe6-7acbe6-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&cw=1366&dev=CCt&bg=lfe&ps=HMf-SMt-APh-RFf-PLn-PId-HBf&cl=clh-cl4&cs=csh-cs1&b=cd&mf=&oc=ab','evolution-nature.jpg', 'light-demo', 'journey'],
  ['Evolution Cooking 3','p=d&clr=4F8573-DA2343-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTmi-OSf-PBh-PSs&ds=vb1-cl4&hd=ab&hp=&tp=160&cw=1366&dev=CCt&bg=ckg&ps=HMf-SMt-APh-RFf-PLn-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=hvml&oc=ab','evolution-cooking-3.jpg', 'light-demo', 'journey'],
  //['Evolution Fitness 2','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc2-lc2&hd=ab&dev=CCt&bg=fit','evolution-fitness-2.jpg'],
  ['Evolution Yoga 2','p=d&clr=DB9942-FE4042-EEE4C1-DB9942&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd1-OSf-PBh-PSs&ds=hre-id2-lwid1-da2-d1f&hd=e&hp=&tp=320&cw=1366&dev=CCt&bg=yg1&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-yoga-2.jpg', 'light-demo', 'journey'],
  ['Evolution Golf 2','p=d&clr=003181-1D0009-1B1528-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hrc2-lc31-lbe-lc3&hd=c2&hp=&tp=&cw=1366&dev=CCt&bg=glf&ps=HMf-SMt-APr-RFf-PLd-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=c3&mf=','evolution-golf-2.jpg', 'dark-demo', 'journey'],
  ['Evolution Fitness 3','p=d&clr=2980b9-3498db-ffffff-fefefe&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hre-id2-lwid1-da2-d1f&hd=e&hp=&tp=&cw=1366&dev=CCt&bg=yg1&ps=HMf-SMt-APb-RFf-PLh-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=','evolution-fitness-3.jpg', 'light-demo', 'journey'],
  ['Evolution Stock 2','p=d&clr=2980b9-3498db-143041-216188&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd4-OSf-PBh-PSs&ds=hrc4-cl4-a3&hd=hc&hp=&tp=235&dev=CCt&cw=1366&bg=bus&ps=HMf-SMt-APr-RFf-PLh-PId-HBf-MPl-SPl&cl=clh-cl4&cs=csh-cs1&b=&mf=&oc=ab','evolution-stock-2.jpg', 'dark-demo', 'journey'],












  // ['Explorer','p=d&clr=005ffe-fadc4a-F4F5FC-FFFFFF&cm=&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-l2d-l3d-bd3-l4d-l5d&hd=d1&hp=&tp=0&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=','d_explorer.jpg'],
  // ['Explorer Dark','p=d&clr=005ffe-fadc4a-141313-1F1F1F&cm=d&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-l2d-l3d-bd3-l4d-l5d&hd=d1&hp=&tp=0&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=','d_explorer.jpg'],
  // ['Curiosity 1','p=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-lc1&hd=c1','d_curiosity_1.jpg'],
  // ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&dev=CCt','d_curiosity_2.jpg'],
  // ['Curiosity 3', 'p=d&clr=7047EB-FE4042-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hrc3-lc3-hc3-lc31&hd=d1&hp=&tp=50&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', 'd_curiosity_2.jpg'],
  // ['Blue fit','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc4-cs2&hd=c1&dev=CCt&bg=fit','d_blue_fit.jpg'],
  // ['All Lessons',' p=d&clr=fe2942-cbc97e-ffffff-f7f7f9&cm=&sb=&ds=ld1-l1d-ld4-ld41-lc1-lc2-lc3-lc31-lc4-l3d-l4d-l5d-le-cl1-cl2-cl3-cl4-cl5-cl6-cs1-cs2-cs3-cs4-cs5-cs6-clh&hd=d1&hp=&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl3&cs=csh-cs1&b=','d_blue_fit.jpg'],
  // ['All Resume','p=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd1-hrd2-hrd3-hrd4-hrc1-hrc2-hrc3-hrc4-hre&hd=d1','d_discovery_2.jpg'],
  // ['Discovery Learn', 'p=d&clr=005ffe-fadc4a-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd6-OSf-PBnal-PSs&ds=hrd4-lwid1-da2&hd=d1&hp=&tp=50&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', 'd_discovery_2.jpg'],
  // ['Fitness', 'p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=fit&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', 'd_discovery_2.jpg'],

  // ['Business', 'p=d&clr=398789-8ED3D5-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '100.jpg'],
  // ['Business 2', 'p=d&clr=398789-8ED3D5-A2D8DF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus2&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=c3&mf=', '102.jpg'],
  // ['Education', 'p=d&clr=245D51-8ED3D5-ffffff-EAEFEF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=edc&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '103.jpg'],
  // ['Cooking', 'p=d&clr=4D3355-DA2343-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=ckg&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '104.jpg'],
  // ['Golf', 'p=d&clr=3C7A17-639147-3C7A17-FFFFFF&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=glf&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '101.jpg'],
  // ['Makeup', 'p=d&clr=DB588F-DB588F-ffffff-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=mkp&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '201.jpg'],
  // ['Nutrition', 'p=d&clr=F47656-F47656-ffffff-F7CD7E&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=nrn&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '202.jpg'],
  // ['Life', 'p=d&clr=7acbe6-7acbe6-7acbe6-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=lfe&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '203.jpg'],
  // ['Stock', 'p=d&clr=0F0FBB-F47656-0F0FBB-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=stk&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '109.jpg'],
  // ['Photography', 'p=d&clr=FE3C92-F47656-1F282D-292F35&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=pht&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '110.jpg'],
  // ['Health', 'p=d&clr=5669FF-FF7272-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=hlt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '111.jpg'],
  // ['Yoga 1', 'p=d&clr=DB9942-FE4042-EEE4C1-DB9942&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=280&dev=CCt&bg=yg1&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '112.jpg'],
  // ['Paint', 'p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=150&dev=CCt&bg=pnt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '113.jpg'],

  // ['Discovery Learn', 'p=d&clr=005ffe-fadc4a-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd6-OSf-PBnal-PSs&ds=hrd4-lwid1-da2&hd=d1&hp=&tp=50&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '204.jpg'],
  // ['Fitness', 'p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=fit&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '205.jpg'],
  // ['Business', 'p=d&clr=398789-8ED3D5-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '206.jpg'],
  // ['Business 2', 'p=d&clr=398789-8ED3D5-A2D8DF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus2&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=c3&mf=', '207.jpg'],
  // ['Education', 'p=d&clr=245D51-8ED3D5-ffffff-EAEFEF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=edc&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '210.jpg'],
  // ['Cooking', 'p=d&clr=4D3355-DA2343-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=ckg&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '119.jpg'],
  // ['Golf', 'p=d&clr=3C7A17-639147-3C7A17-FFFFFF&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=glf&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '120.jpg'],
  // ['Makeup', 'p=d&clr=DB588F-DB588F-ffffff-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=mkp&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '121.jpg'],
  // ['Nutrition', 'p=d&clr=F47656-F47656-ffffff-F7CD7E&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=nrn&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '122.jpg'],
  // ['Life', 'p=d&clr=7acbe6-7acbe6-7acbe6-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=lfe&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '123.jpg'],
  // ['Stock', 'p=d&clr=0F0FBB-F47656-0F0FBB-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=stk&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '208.jpg'],
  // ['Photography', 'p=d&clr=FE3C92-F47656-1F282D-292F35&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=pht&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '209.jpg'],
  // ['Health', 'p=d&clr=5669FF-FF7272-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=hlt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '210.jpg'],
  // ['Yoga 1', 'p=d&clr=DB9942-FE4042-EEE4C1-DB9942&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=280&dev=CCt&bg=yg1&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '211.jpg'],
  // ['Paint', 'p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=150&dev=CCt&bg=pnt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '128.jpg'],

  // ['Discovery Learn', 'p=d&clr=005ffe-fadc4a-F4F5FC-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPl-OTd6-OSf-PBnal-PSs&ds=hrd4-lwid1-da2&hd=d1&hp=&tp=50&dev=CCt&bg=&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '129.jpg'],
  // ['Fitness', 'p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=fit&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '130.jpg'],
  // ['Business', 'p=d&clr=398789-8ED3D5-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '214.jpg'],
  // ['Business 2', 'p=d&clr=398789-8ED3D5-A2D8DF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus2&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=c3&mf=', '213.jpg'],
  // ['Education', 'p=d&clr=245D51-8ED3D5-ffffff-EAEFEF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=edc&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '212.jpg'],
  // ['Cooking', 'p=d&clr=4D3355-DA2343-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=ckg&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '136.jpg'],
  // ['Golf', 'p=d&clr=3C7A17-639147-3C7A17-FFFFFF&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=glf&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '214.jpg'],
  // ['Stock', 'p=d&clr=0F0FBB-F47656-0F0FBB-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=stk&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '215.jpg'],
  // ['Photography', 'p=d&clr=FE3C92-F47656-1F282D-292F35&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=pht&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '216.jpg'],
  // ['Health', 'p=d&clr=5669FF-FF7272-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=hlt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '217.jpg'],
  // ['Yoga 1', 'p=d&clr=DB9942-FE4042-EEE4C1-DB9942&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=280&dev=CCt&bg=yg1&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '218.jpg'],
  // ['Paint', 'p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=150&dev=CCt&bg=pnt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '146.jpg'],


  // ['Business', 'p=d&clr=398789-8ED3D5-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '147.jpg'],
  // ['Business 2', 'p=d&clr=398789-8ED3D5-A2D8DF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus2&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=c3&mf=', '148.jpg'],
  // ['Education', 'p=d&clr=245D51-8ED3D5-ffffff-EAEFEF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=edc&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '149.jpg'],
  // ['Cooking', 'p=d&clr=4D3355-DA2343-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=ckg&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '220.jpg'],
  // ['Golf', 'p=d&clr=3C7A17-639147-3C7A17-FFFFFF&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=glf&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '221.jpg'],
  // ['Makeup', 'p=d&clr=DB588F-DB588F-ffffff-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=mkp&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '222.jpg'],
  // ['Nutrition', 'p=d&clr=F47656-F47656-ffffff-F7CD7E&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=nrn&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '223.jpg'],
  // ['Life', 'p=d&clr=7acbe6-7acbe6-7acbe6-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=lfe&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '155.jpg'],
  // ['Stock', 'p=d&clr=0F0FBB-F47656-0F0FBB-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=stk&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '156.jpg'],
  // ['Photography', 'p=d&clr=FE3C92-F47656-1F282D-292F35&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=pht&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '157.jpg'],
  // ['Health', 'p=d&clr=5669FF-FF7272-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=hlt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '158.jpg'],
  // ['Yoga 1', 'p=d&clr=DB9942-FE4042-EEE4C1-DB9942&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=280&dev=CCt&bg=yg1&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '159.jpg'],
  // ['Paint', 'p=d&clr=FFB516-FFB516-1A2023-252C2E&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=150&dev=CCt&bg=pnt&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '223.jpg'],

  // ['Business', 'p=d&clr=398789-8ED3D5-F4F5FC-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '224.jpg'],
  // ['Business 2', 'p=d&clr=398789-8ED3D5-A2D8DF-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=bus2&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=c3&mf=', '225.jpg'],
  // ['Education', 'p=d&clr=245D51-8ED3D5-ffffff-EAEFEF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=edc&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '163.jpg'],
  // ['Cooking', 'p=d&clr=4D3355-DA2343-FFFFFF-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=ab&hp=&tp=300&dev=CCt&bg=ckg&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '164.jpg'],
  // ['Golf', 'p=d&clr=3C7A17-639147-3C7A17-FFFFFF&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=glf&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '165.jpg'],
  // ['Makeup', 'p=d&clr=DB588F-DB588F-ffffff-FFFFFF&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=mkp&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '166.jpg'],
  // ['Nutrition', 'p=d&clr=F47656-F47656-ffffff-F7CD7E&cm=l&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=nrn&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '167.jpg'],
  // ['Life', 'p=d&clr=7acbe6-7acbe6-7acbe6-FFFFFF&cm=&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=lfe&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=ct&mf=', '226.jpg'],
  // ['Photography', 'p=d&clr=FE3C92-F47656-1F282D-292F35&cm=d&sb=MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs&ds=hre-lc31-lbe-lc3&hd=e&hp=&tp=300&dev=CCt&bg=pht&ps=HMf-SMt-APr-RFf-PLd-PId-HBf&cl=clh-cl5&cs=csh-cs1&b=&mf=', '170.jpg'],
 
  // ['Discovery 2','p=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id2-ld2-da2&hd=d1','d_discovery_2.jpg'],
  // ['Explorer','p=d&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-bd3&hd=d1','d_explorer.jpg'],
  // ['Curiosity 1','p=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-lc1&hd=c1','d_curiosity_1.jpg'],
  // ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&dev=CCt','d_curiosity_2.jpg'],
  // ['Blue fit','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc4-cs2&hd=c1&dev=CCt&bg=fit','d_blue_fit.jpg'],
  // ['Discovery 2','p=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id2-ld2-da2&hd=d1','d_discovery_2.jpg'],
  // ['Explorer','p=d&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-bd3&hd=d1','d_explorer.jpg'],
  // ['Curiosity 1','p=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-lc1&hd=c1','d_curiosity_1.jpg'],
  // ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&dev=CCt','d_curiosity_2.jpg'],
  // ['Blue fit','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc4-cs2&hd=c1&dev=CCt&bg=fit','d_blue_fit.jpg'],
  // ['Discovery 2','p=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id2-ld2-da2&hd=d1','d_discovery_2.jpg'],
  // ['Explorer','p=d&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-bd3&hd=d1','d_explorer.jpg'],
  // ['Curiosity 1','p=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-lc1&hd=c1','d_curiosity_1.jpg'],
  // ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&dev=CCt','d_curiosity_2.jpg'],
  // ['Blue fit','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc4-cs2&hd=c1&dev=CCt&bg=fit','d_blue_fit.jpg'],

  // ['Discovery 2','p=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id2-ld2-da2&hd=d1','d_discovery_2.jpg'],
  // ['Explorer','p=d&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-bd3&hd=d1','d_explorer.jpg'],
  // ['Curiosity 1','p=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-lc1&hd=c1','d_curiosity_1.jpg'],
  // ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&dev=CCt','d_curiosity_2.jpg'],
  // ['Blue fit','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc4-cs2&hd=c1&dev=CCt&bg=fit','d_blue_fit.jpg'],
  // ['Discovery 2','p=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id2-ld2-da2&hd=d1','d_discovery_2.jpg'],
  // ['Explorer','p=d&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-bd3&hd=d1','d_explorer.jpg'],
  // ['Curiosity 1','p=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-lc1&hd=c1','d_curiosity_1.jpg'],
  // ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&dev=CCt','d_curiosity_2.jpg'],
  // ['Blue fit','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc4-cs2&hd=c1&dev=CCt&bg=fit','d_blue_fit.jpg'],
  // ['Discovery 2','p=d&sb=MSt-MPl-SSt-SFr-SPr-OTd2-OSf-PBh-PSs&ds=hrd2-id2-ld2-da2&hd=d1','d_discovery_2.jpg'],
  // ['Explorer','p=d&sb=MSt-MPl-SSf-SFr-SPr-OTd3-OSf-PBh-PSs&ds=hrd3-l1d-bd3&hd=d1','d_explorer.jpg'],
  // ['Curiosity 1','p=d&sb=MSf-MPl-SSt-SFf-SPl-OTc1-OSf-PBh-PSs&ds=hrc1-ctc1-lc1&hd=c1','d_curiosity_1.jpg'],
  // ['Curiosity 2','p=d&clr=474954-7284A8-FFFFFF-F4F4F4&sb=MSf-MPl-SSt-SFf-SPr-OTd2-OSf-PBh-PSs&ds=hrc2-lc2&hd=c2&dev=CCt','d_curiosity_2.jpg'],
  // ['Blue fit','p=d&clr=687FFF-7284A8-141313-1F1F1F&cm=d&sb=MSf-MPl-SSt-SFf-SPl-OTd5-OSf-PBh-PSs&ds=hrc4-cs2&hd=c1&dev=CCt&bg=fit','d_blue_fit.jpg']
]

//console.log('Dynamic Sections')

class DynamicSections {

    constructor() {
        this.dIdCnt = 20
        this.events()
        if(IsR2){
            this.sortSections()
            $('body').on('click','.dynamic_sections_item_remove',function (){
                DYNAMIC_SECTIONS.remove_dynamic_section($(this))
            }) 
            $('.dynamic_sections_add').click(function (){
                TOPBAR.collapseTopbar()
                $('.r2_sidebar').addClass('with_account_page')
                account_page_show('add_section')
                if ($('.add_section_page_content > div').length == 0){
                    DYNAMIC_SECTIONS.add_sections_to_add_page()
                }
                //$(".account_page.add_section").css('margin-top', $(".r2_topbar").css("height"))
                
            })
            $('body').on('click','.add_this_section',function (){
                $('.r2_sidebar').removeClass('with_account_page')
                DYNAMIC_SECTIONS.addDynamicSection($(this).attr('did'))
                account_page_hide('add_section')
                DYNAMIC_SECTIONS.scroll_to_new_section() 
            })
            $('.add_section_page_back, .add_section_page_close').click(function (){
                $('.r2_sidebar').removeClass('with_account_page')
                account_page_hide('add_section')
            })
            $('body').on('click','.add_section_categories > div', function(){
                $('.add_section_categories > div').removeClass('active')
                $(this).addClass('active')
                DYNAMIC_SECTIONS.loadSection(POST_SECTIONS[$(this).data('key')])
            })
        }
    }

    events() {
        $('.r3_sections_wrapper > div').click(function () {
            $('.apply_button').removeClass('disab')
            //console.log('sections')
            DYNAMIC_SECTIONS.dynamicSectionsPresets($(this).data('value'))
        })
    }
    sortSections(){
        $( ".dynamic_sections_wrap_inner" ).sortable({
            update: function( event, ui ) {
                setTimeout(function (){
                    DYNAMIC_SECTIONS.dsScrollToSection(ui.item.attr('d_id'))
                },200)
                DYNAMIC_SECTIONS.reorderDynamicSection()
            }
        });
    }
    dsScrollToSection(d_id){
        var $scroll_elm = $('.page_wrap')
        if ($('.p_contant_out').css('overflow-y') == 'scroll'){
            $scroll_elm = $('.p_contant_out')
        }
        let offset = $('.main-content div[d_id="'+d_id+'"]')[0].offsetTop
        $scroll_elm.animate({scrollTop:offset},200);
    }
    addDynamicSection(val){
        $('.dynamic_sections_add_popup').hide()
        this.dIdCnt++
        //var val = $('.dynamic_sections_add_popup select').val()
        this.addDynamicSectionHelper(val)
        $('.jarallax').jarallax({speed: 0.2});
    
        DEMO['sections'] = this.list_dnamic_sections();
        ROUTER.setUrl()
    }
    reorderDynamicSection(){
        var dynamic_area = this.get_dynamic_section_wrap()
    
        var sections_obj = {}
        $('div['+dynamic_area+'] div[data-section-id]').each(function (){
            sections_obj[$(this).attr('d_id')] = $(this)
        })
    
        $('div['+dynamic_area+']').html('')
        var new_order = []
        $('.dynamic_sections_item_wrap').each(function (){
            let d_id = $(this).attr('d_id')
            $('div['+dynamic_area+']').append(sections_obj[d_id])
        })
    
        DEMO['sections'] = this.list_dnamic_sections();
        ROUTER.setUrl()
    }
    get_dynamic_section_wrap(){
        if (PAGE == 'dashboard'){
            return 'data-content-for-index'
        }
        if (PAGE == 'post'){
            return 'data-content-for-post'
        }
    }
    list_dnamic_sections(){
        var r = []
        $('.dynamic_sections_item_wrap').each(function (){
            let d_id = $(this).attr('d_id')
            let sname = d_id.split('|')[0]
            r.push(UCODE.sections2code[sname])
        })
        return r.join('-')
    }
    add_sections_to_add_page(){
        $('.add_section_categories').html('')
        var categories = POST_SECTIONS.categories
        for(var key of Object.keys(categories)){
            var list = `<div data-key="${categories[key]}"><i class="${PRODUCT_CATEGORY_ICONS[categories[key]]}"></i><span>${categories[key]}</span></div>`
            $('.add_section_categories').append(list)
        }
        this.loadSection(POST_SECTIONS['Banners'])
        $('.add_section_categories div[data-key="Banners"]').addClass('active')
    }
    loadSection(sectionNames){
        var wrapper = $('.add_section_content')
        wrapper.html('')
        for(var sectionName of sectionNames){
            var newSection = $(MHTML.sections[sectionName])
            newSection = LAYOUT.replaceDynamicSectionBlockIds(newSection)
            newSection = DYNAMIC_SECTIONS.replace_wistia_ids(newSection)
            var sectionTitle = PRODUCT_SECTIONS_NAMES[sectionName]
            let m = '<div class="add_section_header_wrapper"><div class="add_section_name">'+sectionTitle+'</div><div class="add_this_section" did="'+sectionName+'"><span>Add Section</span><i class="far fa-plus"></i></div></div>'
            newSection.prepend(m)
            wrapper.append(newSection)
        }
        $(".add_section_header_wrapper").parent().css("width", "100%")
        $('.add_section_content').scrollTop(0)
    }
    replace_wistia_ids($new_section){
        /*
        if ($new_section.find('.wistia_embed').length != 0) {
            let w_id = $new_section.find('.wistia_embed').attr('id') + Math.floor(Math.random() * 9999)
            $new_section.find('.wistia_embed').attr('id',w_id)
        }*/
        return $new_section
    }
    dynamicSectionsPresets(val) {
        if (val == 'select') { return }
        $('.dynamic_sections_wrap_inner').html('')
        $('div[data-content-for-index]').html('')
        for (var section of val.split('-')) {
            this.addDynamicSectionHelper(UCODE.code2sections[section])
        }
        $('.jarallax').jarallax({ speed: 0.2 });
        DEMO['sections'] = val;
        ROUTER.setUrl()
        TOPBAR.changed('dynamic_sections')
    }
    
    remove_dynamic_section($this){
        let section_d_id = $this.closest('.dynamic_sections_item_wrap').attr('d_id')
        $this.closest('.dynamic_sections_item_wrap').remove()
        $('div[d_id="'+section_d_id+'"]').remove()
    
        DEMO['sections'] = this.list_dnamic_sections();
        ROUTER.setUrl()
    }

    addDynamicSectionHelper(val) {
        let dId = val + '|' + this.dIdCnt
        if(IsR2){
            let st = `<div class="dynamic_sections_item_wrap" d_id="` + dId + `">
            <span>`+ DYNAMIC_SECTIONS_DASHBOARD[val] + `</span>              
            <div class="dynamic_sections_item_icons">
                <div class="dynamic_sections_item_remove"><svg xmlns="http://www.w3.org/2000/svg" width="14.517" height="16" viewBox="0 0 14.517 16">
                <g id="Group_936" data-name="Group 936" transform="translate(-184.246 -778.25)">
                  <path id="Vector" d="M14,2.96c-1.2-.119-2.4-.208-3.6-.275V2.678l-.164-.967C10.126,1.027,9.963,0,8.222,0H6.273C4.54,0,4.376.982,4.257,1.7L4.1,2.656c-.692.045-1.384.089-2.075.156L.508,2.96a.557.557,0,1,0,.1,1.108L2.13,3.92A59.305,59.305,0,0,1,13.9,4.076h.06a.563.563,0,0,0,.558-.506A.57.57,0,0,0,14,2.96Z" transform="translate(184.246 778.25)" fill="#ff5858"/>
                  <path id="Vector-2" data-name="Vector" d="M11.01.29A.94.94,0,0,0,10.333,0H.931A.928.928,0,0,0,.254.29.958.958,0,0,0,0,.989L.463,8.621c.082,1.131.186,2.544,2.782,2.544H8.02c2.6,0,2.7-1.406,2.782-2.544L11.263,1A.964.964,0,0,0,11.01.29ZM6.867,7.438H4.39a.558.558,0,0,1,0-1.116H6.867a.558.558,0,0,1,0,1.116Zm.625-2.975H3.773a.558.558,0,1,1,0-1.116H7.492a.558.558,0,1,1,0,1.116Z" transform="translate(185.869 783.085)" fill="#ff5858"/>
                </g>
              </svg>
              </div>
                <div class="dynamic_sections_item_handle"><i class="fas fa-bars"></i></div>
            </div>
        </div>`
            $('.dynamic_sections_wrap_inner').append(st)
        }
        let htmlText = this.replaceBeforeAddingSection(MHTML.sections[val])
        let $newSection = $(htmlText)
        $newSection.attr('d_id', dId).attr('not-dirty', 'true')

        $newSection = this.jarallaxFix($newSection)

        $newSection = LAYOUT.replaceDynamicSectionBlockIds($newSection)
        $('div[data-content-for-index]').append($newSection)
    }

    replaceBeforeAddingSection(text) {
        text = text.replace(/42isirdu7n/g,'c1ludijve5')
        text = text.replace(/rykrvj3o6k/g, 'c1ludijve5')
        text = text.replace(/7zaabl7v7i/g, 'c1ludijve5')
        
        text = text.replace('There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incididunt ut labore et dolor.')
        text = text.replace("Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec.')
        text = text.replace("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.", 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec.')
        text = text.replace("Contrary to popular belief, Lorem ipsum is not", 'Lorem ipsum dolor sit amet, consectetur elit.')
        text = text.replace("Contrary to popular belief", 'Lorem ipsum dolor sit amet')
        text = text.replace(/is simply dummy text of the printing and typesetting industry/g, 'consectetur adipiscing elit, sed do eiusmod tempor incididunt')
        text = text.replace(/simply dummy text of the printing and typesetting/g, 'consectetur adipiscing elit, sed do eiusmod tempor')
        text = text.replace(/simply dummy text/g, 'do eiusmod tempor')
        text = text.replace("New post 31", 'Lorem ipsum amet')
        text = text.replace(/yaron zeltzer/g, 'Jeff Ipsum')
        text = text.replace("Membership Sample course", 'Learn How to Ipsum')
        text = text.replace(/kjb-settings-id/g, 'kjb-settings-disabled')
        text = text.replace(/clmn_show_grids-true/g, '')
        return text
    }

    jarallaxFix($newSection) {
        if ($newSection.find('.jarallax') != 0) {
            $newSection.find('.jarallax').attr('style', '')
            $newSection.find('div[id*="jarallax-container"]').remove()
        }
        return $newSection
    }
    scroll_to_new_section(){
        var $scroll_elm = $('.page_wrap')
        if ($('.p_contant_out').css('overflow-y') == 'scroll'){
            $scroll_elm = $('.p_contant_out')
        }
    
        $scroll_elm[0].scrollTo(0,0)
        setTimeout(function (){
            let offset = $('div[data-content-for-index] > div:nth-last-child(1)')[0].offsetTop
            //$('.page_wrap')[0].scrollTo(0,offset,{behavior: 'smooth'})
            $scroll_elm.animate({scrollTop:offset},'50');
    
            $section_drag_box = $('.dynamic_sections_wrap_inner .dynamic_sections_item_wrap:nth-last-child(1)')
            $section_drag_box.css('background-color','#004CFF')
            setTimeout(function (){
                $section_drag_box.css('background-color','#f0eeee')
                setTimeout(function (){
                    $section_drag_box.css('background-color','#004CFF')
                    setTimeout(function (){
                        $section_drag_box.css('background-color','unset')
                    },1000)
                },1000)
            },1000)
    
    
        },1000)
    
    }

}



class Background {

    backgroundImages(topImg, topHeight, bottomImg, bottomHeight) {
        $('.background-theme-image-top img').attr('src', topImg)
        $('.background-theme-image-bottom img').attr('src', bottomImg)
        $('.background-theme-image-top').css('height', topHeight)
        $('.background-theme-image-bottom').css('height', bottomHeight)
        $('.background-theme-image-top').attr('style', 'display: block; height:' + topHeight)
        if (bottomHeight != '') {
            $('.background-theme-image-bottom').attr('style', 'display: block; height:' + bottomHeight)
        }
        if (topImg == "") {
            $('.background-theme-image-top').attr('style', 'display: none;')
            JTB_overwrite.theme_settings["show_theme_top_image"] = "false"
        }
        if (bottomImg == "") {
            $('.background-theme-image-bottom').attr('style', 'display: none;')
            JTB_overwrite.theme_settings["show_theme_bottom_image"] = "false"
        }
        if (JTB_overwrite['theme_settings'] == undefined) {
            JTB_overwrite['theme_settings'] = {}
        }
        JTB_overwrite.theme_settings["show_theme_top_image"] = "true"
        JTB_overwrite.theme_settings["theme_top_image"] = topImg
        JTB_overwrite.theme_settings["top_image_height"] = topHeight
        JTB_overwrite.theme_settings["show_theme_bottom_image"] = "true"
        JTB_overwrite.theme_settings["theme_bottom_image"] = bottomImg
        JTB_overwrite.theme_settings["bottom_image_height"] = bottomHeight
    }


    contentTopBottomPadding(top, bottom) {
        $('.main-content-spacer').css('padding-bottom', bottom)
        if ($('.content_top_padding input').val() > 0) {
            top = $('.content_top_padding input').val()
        }
        if (bottom > 0) {
            var st = `
            @media(max-width: 768px){
                .main-content-spacer{
                    padding-bottom: 20px !important;
                }
            }
            `
            $('.dynamic_styles').append(st);
        }
        $('.top_padding_dashboard input').val(parseInt(top))
        SIDEBARS.changeContentPadding(parseInt(top))
        
        if (DEMO.contentTopPaddingPost != '' && DEMO.contentTopPaddingPost != 0){
            let postPadding = parseInt(top) * 0.75
            POST.changePostContentPadding(postPadding)
        } else{
            POST.changePostContentPadding(0)
        }
       

        if (JTB_overwrite['theme_settings'] == undefined) {
            JTB_overwrite['theme_settings'] = {}
        }
        var appendObj = {
            "theme_settings": {
                "content_bottom_padding": `${bottom.toString()}`,

            }
        }

        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }



    evNone() {
        $('.dynamic_styles').html('')
        this.contentTopBottomPadding('0', '0')
        $('.background-theme-image-top').attr('style', 'display: none')
        $('.background-theme-image-bottom').attr('style', 'display: none')
        JTB_overwrite.theme_settings["show_theme_top_image"] = "false"
        JTB_overwrite.theme_settings["theme_top_image"] = ''
        JTB_overwrite.theme_settings["top_image_height"] = ''
        JTB_overwrite.theme_settings["show_theme_bottom_image"] = "false"
        JTB_overwrite.theme_settings["theme_bottom_image"] = ''
        JTB_overwrite.theme_settings["bottom_image_height"] = ''
    }

    ev_fitness(isDemo) {
        $('.dynamic_styles').html('')
        this.contentTopBottomPadding('220px', '80px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149314219/settings_images/HXJ7KtVbQ2yH6xlV5do3_young-beautiful-woman-yoga-posing-isolated-white-studio-surface.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149314219/settings_images/cCtmmdrBRYq2wQ6qZJb3_young-caucasian-plus-size-female-model-training-yellow.png'
        this.backgroundImages(topImg, '300px', bottomImg, '450px')
        if (isDemo) {
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--bg-color-2) !important')
            let st = `.background-theme-image-top:before, .background-theme-image-bottom:before{background:none !important;} .background-theme-image-top img {object-position: bottom; max-width: 1316px; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:30%; margin-left:auto;}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}}`
            $('.dynamic_styles').append(st);
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n.background-theme-image-top:before, .background-theme-image-bottom:before{\n    background:none !important;\n}\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:1327px;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nwidth:30%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)



    }



    evYoga1(isDemo) {

        $('.dynamic_styles').html('')
        this.contentTopBottomPadding('320px', '400px')
        //setColors('#DB9942', '#FE4042', '', '', '#EEE4C1', '#DB9942', '', '', '#000000', '#212121')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149307960/settings_images/x437b5TrTce5uFtWSem2_sport-fitness-fit-woman-yoga-practice-outdoor-summer-park-young-adult-caucasian-female-legs-split-yoga-mat-athletic-cute-sportswoman-stretching-legs-outside.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149307960/settings_images/Ob1DLbjjSjS6jEOyYCSB_class-six-diverse-people-doing-chaturanga-yoga-pose-floor-level-view.jpg'
        this.backgroundImages(topImg, '500px', bottomImg, '350px')
        if (isDemo) {
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important').addClass('dark')
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149307960/settings_images/kQLc6ya2Sjiehxa6AmJg_close-up-view-asian-woman-doing-morning-yoga-after-waking-up-home-sitting-lotus-pose.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149307960/settings_images/vuKBlt1YR8OO8NSerYHA_sports-fitness-modern-technology-concept-woman-practicing-side-splits-floor-simultaneously-checking-email-open-pc-front-her.jpg'
            $('div[d_id="lesson_banner_evolution"] section').css('background-image', 'url(' + lessonBannerImg + ')')


            var st = `
        #section-p_secondary_sidebar{
            color: #fff;
            --text-color-1 : #fff;
        }
        .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }
        `
            $('.dynamic_styles').append(st)
            //html
            $('.blog_section_heading *').css('color', 'var(--accent-color-1)')
            $('.view_all_wrap *').css('color', 'var(--accent-color-1)')
        }
        // --  json  -----
        var appendObj =
        {
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar{color: #fff; --text-color-1 : #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}",
                    "settings.section_style|2": "prepend|<class>dark</class>"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lessons_evolution|1": {
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .blog_section_heading *{\ncolor: var(--accent-color-1)\n}\n#this-section .view_all_wrap a{\ncolor: var(--accent-color-1) !important;\n}"
                },
                "lessons_evolution|2": {
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .blog_section_heading *{\ncolor: var(--accent-color-1)\n}\n#this-section .view_all_wrap a{\ncolor: var(--accent-color-1) !important;\n}"
                },
                "lessons_evolution|3": {
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .blog_section_heading *{\ncolor: var(--accent-color-1)\n}\n#this-section .view_all_wrap a{\ncolor: var(--accent-color-1) !important;\n}"
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }



    evPaint(isDemo) {
        $('.dynamic_styles').html('')
        this.contentTopBottomPadding('150px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149314474/settings_images/JvIBK8r2SqyMFF2Q8t1t_11_2x.jpg'
        let bottomImg = ''
        this.backgroundImages(topImg, '100%', bottomImg, '0')
        if (isDemo) {
            let st = `
        #section-p_secondary_sidebar{
            color: #fff;
            --text-color-1 : #fff;
        }
        .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }
        .background-theme-image-top img{
            object-position: top !important;
            max-width: 100% !important;
            }
    
            #section-p_secondary_sidebar .section{
            background:  url('https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149314474/settings_images/FHoVp7EgTMCiZf5eikC2_fluide-liquide-art-acrylic-oil-paints-texture-backdrop-abstract-mixing-paint-effect-liquid-colored-acrylic-artwork-flows-splashes-fluid-art-texture-overflowing-colors.jpg');
            background-size: cover;
            position: relative;
            }
            #section-p_secondary_sidebar .section:before{
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgb(0 0 0 / 40%)
    
            }
            .view_all_wrap a{
                color: var(--text-color-1) !important;
            }
    `

            $('.dynamic_styles').append(st);
        }


        //html


        // --  json  -----
        var appendObj = {
            "theme_settings": {
                "background_images_style": "/* -- Custom Selectors --*/\n.background-theme-image-top:before, .background-theme-image-bottom:before{\n    background:none !important;\n}\n\n.background-theme-image-top img{\nobject-position:bottom;\n}\n\n.background-theme-image-bottom img{\nwidth:30%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.bg_type": "image",
                    "settings.bg_image": "/themes/2149314474/settings_images/FHoVp7EgTMCiZf5eikC2_fluide-liquide-art-acrylic-oil-paints-texture-backdrop-abstract-mixing-paint-effect-liquid-colored-acrylic-artwork-flows-splashes-fluid-art-texture-overflowing-colors.jpg",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar{color: #fff; --text-color-1 : #fff;}\n #this-section .section:before{content: '';position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: rgb(0 0 0 / 40%);}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}",
                    "settings.section_style|2": "prepend|<class>dark</class>"
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

    }

    evBusiness(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#398789', '#8ED3D5', '', '', '#F4F5FC', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/CCi6fAG2Tz6zXUfJ54l2_Group_1120.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/5jDV0OFQKuFdHHJ0xpgd_Group_1121.png'
        this.backgroundImages(topImg, '640px', bottomImg, 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/4E9DJlpWSoeRv71vKd1A_report-analysis-progress-chart-concept.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/8BdQEkxRZK37gqQLlGjn_finance-consulting-discussing-executive-people-plan2x.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')
            let st = `.background-theme-image-top:before, .background-theme-image-bottom:before{background:none !important;} .background-theme-image-top img {object-position: center !important; max-width: 100% !important; margin: 0 auto 0 auto !important;} .background-theme-image-bottom img{width:100% !important; object-position: bottom !important}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        #section-p_secondary_sidebar *{
            color: #fff;
        }
        #section-p_secondary_sidebar .section{
            background: var(--accent-color-1)
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }`
            $('.dynamic_styles').append(st);
            //html
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n.background-theme-image-top:before, .background-theme-image-bottom:before{\n    background:none !important;\n}\n\n.background-theme-image-top img{\nobject-position:center;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)



    }

    evBusiness2(isDemo) {
        //console.log(isDemo)
        $('.dynamic_styles').html('')
        //setColors('#398789', '#8ED3D5', '', '', '#A2D8DF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')
        let topImg = 'https://s3.amazonaws.com/kajabi-storefronts-production/themes/2149752598/settings_images/ZxlIdP5PQf6n3TZAvWPW_workplace-team-cooperation-businesswoman-laptop-office.jpg'
        let bottomImg = 'https://s3.amazonaws.com/kajabi-storefronts-production/themes/2149752598/settings_images/jXqoB0eaR1erH8cooTEg_smiling-businessman-using-mobile-phone-outdoors-buy-sell-stock-market-global-exchange_2x.jpg'
        this.backgroundImages(topImg, '400px', bottomImg, 'auto')

        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://s3.amazonaws.com/kajabi-storefronts-production/themes/2149752598/settings_images/HY83hd0xTWe9O26XkgCT_businessman-touching-tip-bar-chart.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://s3.amazonaws.com/kajabi-storefronts-production/themes/2149752598/settings_images/PKQH8U8ATORFdUPEcz1d_businesswoman-using-tablet-analysis-graph-company-finance-strategy-statistics-success-concept-planning-future-office-room_12x.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
                --text-color-1 : #fff;
                --text-color-2: #fff;
                --accent-color-1: #fff;
            }
            #section-p_secondary_sidebar *{
                color: #fff;
            }
            #section-p_secondary_sidebar .section{
                background: var(--accent-color-1)
            }`
            $('.dynamic_styles').append(st);
            //html
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }

        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)



    }


    evEducation(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#245D51', '#8ED3D5', '', '', '#ffffff', '#EAEFEF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/B9KZiX0OTkC3jGXU1Cjw_back-school-background-with-school-supplies-copy-space.jpg'
        let bottomImg = ''
        this.backgroundImages(topImg, '100%', bottomImg, '')
        if (isDemo) {
            //html
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--bg-color-2) !important')
            var heroResumeImg = 'https://s3.amazonaws.com/kajabi-storefronts-production/themes/2149752598/settings_images/s3Hv6IkoRqilRx955jUv_book-with-green-board-background.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://s3.amazonaws.com/kajabi-storefronts-production/themes/2149752598/settings_images/nyjqPlOmQyChqO3v914v_free-time-students-bachelor-s-campus-life-rhythm-five-friendly-students-are-walking.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top:before{ background:rgb(255 255 255 / 80%) !important;}.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom{display: none;}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}}`
            $('.dynamic_styles').append(st);
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top:before{ background:rgb(255 255 255 / 80%) !important;}.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom, .background-theme-image-bottom img{display: none;}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}}",
                "show_theme_bottom_image": 'false'
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--bg-color-2",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)



    }


    evCooking(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/AzJ6dfqS3e4i8ZeioFus_panoramic-collage-spices-herbs-isolated-background-seasoning-texture-food-packaging-design-collection-colorful-flavoring-top-view.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/2jWdqQktQXaP2X0Rdrpc_black-eyed-beans-curry-indian-cuisine.jpg'
        this.backgroundImages(topImg, '400px', bottomImg, 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/O0ANb5s7Sri8AgDcxiRQ_attractive-young-woman-red-apron-standing-her-kitchen.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/E2J1aJiHQOWf96eQhyRw_female-cook-kitchen-cafe.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        #section-p_secondary_sidebar *{
            color: #fff;
        }
        #section-p_secondary_sidebar .section{
            background: var(--accent-color-1)
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }`
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }

    evOil(isDemo) {
        $('.dynamic_styles').html('')
        //console.log('oillll')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/Fkpe436AQDKKwtOYWABq_vivid-blurred-colorful-background.jpg'
        
        this.backgroundImages(topImg, '100%', '', 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/O0ANb5s7Sri8AgDcxiRQ_attractive-young-woman-red-apron-standing-her-kitchen.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/E2J1aJiHQOWf96eQhyRw_female-cook-kitchen-cafe.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        #section-p_secondary_sidebar *{
            color: #fff;
        }
        #section-p_secondary_sidebar .section{
            background: var(--accent-color-1)
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }`
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evBlob(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/5gSVrAnPSi2we0vG3uXM_5591276.jpg'
        
        this.backgroundImages(topImg, '100%', '', 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/O0ANb5s7Sri8AgDcxiRQ_attractive-young-woman-red-apron-standing-her-kitchen.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/E2J1aJiHQOWf96eQhyRw_female-cook-kitchen-cafe.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        #section-p_secondary_sidebar *{
            color: #fff;
        }
        #section-p_secondary_sidebar .section{
            background: var(--accent-color-1)
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }`
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evDot(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/UefrvMrZQuqd5jGbDsEu_17450.jpg'
        
        this.backgroundImages(topImg, '100%', '', 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/O0ANb5s7Sri8AgDcxiRQ_attractive-young-woman-red-apron-standing-her-kitchen.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/E2J1aJiHQOWf96eQhyRw_female-cook-kitchen-cafe.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        #section-p_secondary_sidebar *{
            color: #fff;
        }
        #section-p_secondary_sidebar .section{
            background: var(--accent-color-1)
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }`
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evSplash(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production//sites/117899/images/f69e8d92-9d88-40c6-b6aa-1138a8df53d1.jpg'
        
        this.backgroundImages(topImg, '100%', '', 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/O0ANb5s7Sri8AgDcxiRQ_attractive-young-woman-red-apron-standing-her-kitchen.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/E2J1aJiHQOWf96eQhyRw_female-cook-kitchen-cafe.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        #section-p_secondary_sidebar *{
            color: #fff;
        }
        #section-p_secondary_sidebar .section{
            background: var(--accent-color-1)
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }`
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evWire(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('200px', '200px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/1bLp4CHyRia63WLuEW67_Group_330.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/lZpeDs4WQc7kOEMgbnNA_Group_306.png'
        
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')
        let st = `
        .background-theme-image-top img {
            object-position: top left; 
            max-width: 40%;
        } 
        .background-theme-image-bottom img{
            max-width:40%; 
            object-position: bottom right;
            margin-left: auto;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left;\nmax-width: 40%;\n}\n.background-theme-image-bottom img{\nmax-width:40%;\nobject-position: bottom right;\nmargin-left: auto;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}.background-theme-image-top:before, .background-theme-image-bottom:before{background: none;}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evTree(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('200px', '200px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/QEsE35BrROOvUIdg9POP_Group_280.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/g5pnJ3RHTf2UH8ppXey5_Group_281.png'
        
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')
        let st = `
        .background-theme-image-top img {
            object-position: top left !important; 
            max-width: 350px !important;
        } 
        .background-theme-image-bottom img{
            max-width:350px !important; 
            object-position: bottom right !important;
            margin-left: auto !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out{
            background: url('https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/9F0N8gmTSzmrgyTZ0gAw_Group_282.png');
            background-size: cover;

        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left;\nmax-width: 350px;\n}\n.background-theme-image-bottom img{\nmax-width:350px;\nobject-position: bottom right;\nmargin-left: auto;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n.p_wrap_out{\nbackground: url('https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/9F0N8gmTSzmrgyTZ0gAw_Group_282.png');\nbackground-size: cover;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evPoly(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('200px', '200px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/ec2da8s4RkmCxbwyusKi_Group_432.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/6NhJpTXQgCQgW1aKyB2k_Group_433.png'
        
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')
        let st = `
        .background-theme-image-top img {
            object-position: top left !important; 
            max-width: 100% !important;
        } 
        .background-theme-image-bottom img{
            max-width:100% !important; 
            object-position: bottom right !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out{
            background: none !important;

        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left !important;\nmax-width: 100% !important;\n}\n.background-theme-image-bottom img{\nmax-width:100% !important;\nobject-position: bottom right !important;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evBlob2(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('200px', '200px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/5HLWnMYFRzWuf3N6RMDY_Group_434.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/uXDiXgBRcSmjvamaNM6M_Path_429.png'
        
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')
        let st = `
        .background-theme-image-top img {
            object-position: top left !important; 
            max-width: 100% !important;
        } 
        .background-theme-image-bottom img{
            max-width:50% !important; 
            object-position: bottom right !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out{
            background: none !important;

        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left !important;\nmax-width: 100% !important;\n}\n.background-theme-image-bottom img{\nmax-width:50% !important;\nobject-position: bottom right !important;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evFlower(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('200px', '200px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/K3xtTs4S2EBsUTF5hbgt_Group_435.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/Ye1gwN6XRSolpQFYmTFN_Group_436.png'
        
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')
        let st = `
        .background-theme-image-top img {
            object-position: top left !important; 
            max-width: 100% !important;
        } 
        .background-theme-image-bottom img{
            max-width:100% !important; 
            object-position: bottom right !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out{
            background: none !important;

        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left !important;\nmax-width: 100% !important;\n}\n.background-theme-image-bottom img{\nmax-width:100% !important;\nobject-position: bottom right !important;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evBlob3(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '250px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production//sites/117899/images/6054bc0e-277f-4d2a-a6fb-99a9c3e0be85.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/pOSihQ0RmcbdicwjA44g_Group_438.png'
        
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')
        let st = `
        .background-theme-image-top img {
            object-position: top left !important; 
            max-width: 100% !important;
        } 
        .background-theme-image-bottom img{
            max-width:100% !important; 
            object-position: bottom right !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out{
            background: none !important;

        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left !important;\nmax-width: 100% !important;\n}\n.background-theme-image-bottom img{\nmax-width:100% !important;\nobject-position: bottom right !important;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evFlower2(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '250px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/ialBsMF9SZO7yGmJzB3Q_Group_439.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/UN1425JUQnWlK01bewUk_Group_440.png'
        
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')
        let st = `
        .background-theme-image-top img {
            object-position: top left !important; 
            max-width: 100% !important;
        } 
        .background-theme-image-bottom img{
            max-width:100% !important; 
            object-position: bottom right !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out {
            background: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/QB62ZDlSTqeGm9ajj4T1_Group_369.png) !important;
            background-size: contain !important;
        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left !important;\nmax-width: 100% !important;\n}\n.background-theme-image-bottom img{\nmax-width:100% !important;\nobject-position: bottom right !important;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n.p_wrap_out {\nbackground: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/QB62ZDlSTqeGm9ajj4T1_Group_369.png);\nbackground-size: contain;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evCircle(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '200px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/zOyHbvyoQgS5cb8Q1FG5_Group_385.png'
        let bottomImg = ''
        
        this.backgroundImages(topImg, '100%', bottomImg, '')
        let st = `
        .background-theme-image-top img {
            object-position: center !important; 
            max-width: 100% !important;
        } 
        .background-theme-image-bottom img{
            max-width:100% !important; 
            object-position: bottom right !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out {
            background: none !important;
        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left !important;\nmax-width: 100% !important;\n}\n.background-theme-image-bottom img{\nmax-width:100% !important;\nobject-position: bottom right !important;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n.p_wrap_out {\nbackground: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/QB62ZDlSTqeGm9ajj4T1_Group_369.png);\nbackground-size: contain;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evGeometry(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '200px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/lUFe5M9cRUOzCnuH3XAE_Repeat_Grid_5.png'
        let bottomImg = ''
        
        this.backgroundImages(topImg, '100%', bottomImg, '')
        let st = `
        .background-theme-image-top img {
            object-position: center !important; 
            max-width: 100% !important;
        } 
        .background-theme-image-bottom img{
            max-width:100% !important; 
            object-position: bottom right !important;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out {
            background: none !important;
        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img {\nobject-position: top left !important;\nmax-width: 100% !important;\n}\n.background-theme-image-bottom img{\nmax-width:100% !important;\nobject-position: bottom right !important;\n}\n.background-theme-image-top:before, .background-theme-image-bottom:before{\nbackground: none;\n}\n.p_wrap_out {\nbackground: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/QB62ZDlSTqeGm9ajj4T1_Group_369.png);\nbackground-size: contain;\n}\n@media (max-width: 768px){\n.background-theme-image-top, .background-theme-image-bottom {\ndisplay: none;\n}\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evPattern(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#4D3355', '#DA2343', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('250px', '200px')

        let topImg = ''
        let bottomImg = ''
        
        this.backgroundImages(topImg, '100%', bottomImg, '')
        let st = `
        .background-theme-image-top img {
            object-position: center !important; 
            max-width: 100% !important;
            display: none;
        } 
        .background-theme-image-bottom img{
            max-width:100% !important; 
            object-position: bottom right !important;
            display: none;
        }
        .background-theme-image-top:before, .background-theme-image-bottom:before{
            background: none;
        }
        .p_wrap_out {
            background: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/9SjGUVNLTlG7vuOn5g0H_VI_BLACK_2000x2000_10-18_Converted_.png) !important;
            background-size: 200px !important;
            background-repeat: repeat !important;
        }
        @media (max-width: 768px){ 
            .background-theme-image-top, .background-theme-image-bottom {
                display: none;
            }
        } 
        `
            $('.dynamic_styles').append(st);
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.p_wrap_out {\nbackground: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2150434620/settings_images/9SjGUVNLTlG7vuOn5g0H_VI_BLACK_2000x2000_10-18_Converted_.png);\nbackground-size: 200px;\nbackground-repeat: repeat;\n}",
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
    evGolf(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#3C7A17', '#639147', '', '', '#3C7A17', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/orndaWSwQ96hpzutVbHm_golf-club-ball-grass-with-sunlight-close-up-golf-club-golf-ball.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/90pJKgSKQyGbgN0KYjhF_golf-ball.jpg'
        this.backgroundImages(topImg, '600px', bottomImg, 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/2cWiY5WJR3mOWQaWRuHC_side-view-man-playing-golf-with-club-ball.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/hfqCY6dNTaCNi8CyQJsH_professional-golfer-bali-indonesia_1_.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
                --text-color-1 : #fff;
                --text-color-2: #fff;
                --accent-color-1: #fff;
            }
            #section-p_secondary_sidebar *{
                color: #fff;
            }
            #section-p_secondary_sidebar .section{
                background: var(--accent-color-1)
            }
            .block-1637908213588{
                background: var(--accent-color-2) !important;
            }
            .p_wrap_out{
                --text-color-1 : #fff;
            }
            .side-post-body{
                color: #000;
            }
            .nblock-course_progress .completion-text{
                color: #000;
            }
            .is_admin_true .commented {
                border: 2px solid #fff !important;
            }
            .is_admin_true .commented .comment-name {
                color: #fff !important;
            }
            .is_admin_true .commented a {
                color: #fff !important;
            }
            #block-post_sidebar_discovery_v1_course_progress_33025, #block-post_sidebar_discovery_v1_post_next_previous_lesson_08216,#block-post_sidebar_discovery_v1_post_downloads_38332{
                color: #000;
                --text-color-1: #000;
            }
            `
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: rgb(255 255 255 / 30%) !important; backdrop-filter: blur(5px);')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n .p_wrap_out{ --text-color-1: #fff;}/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },

            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.background_color": "rgb(255 255 255 / 30%)",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}\n#this-section .section{backdrop-filter: blur(5px);}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "post_sidebar_discovery_v1":{
                    "blocks.post_sidebar_discovery_v1_post_downloads.style": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\n--text-color-1:#000;",
                    "blocks.post_sidebar_discovery_v1_post_next_previous_lesson.style": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\n--text-color-1:#000;\ncolor:#000;",
                    "blocks.post_sidebar_discovery_v1_course_progress.style": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\n--text-color-1:#000;\ncolor:#000;"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }

    evHealth(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#5669FF', '#FF7272', '', '', '#FFFFFF', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')

        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/PUMjPRzSmW14SlMygulQ_medical-stethoscope-white-surface.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/689EvxVvQdeagHsgscaH_hand-holding-red-ribbon-white-background-with-copy-space-solidarity-people-living-with-hiv-aids-symbol.jpg'
        this.backgroundImages(topImg, '400px', bottomImg, 'auto')
        if (isDemo) {
            $('#section-p_secondary_sidebar').addClass("dark")
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/Yhs3UX58TYWOy142Hb4i_young-handsome-physician-medical-robe-with-stethoscope.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/u7JarsR1QSWuf6OYOBAj_confident-young-asia-female-doctor-white-medical-uniform-with-stethoscope-looking-camera-smiling-while-video-conference-call-with-patient-health-hospital.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}} .nblock-outline{
            --text-color-1 : #fff;
            --text-color-2: #fff;
            --accent-color-1: #fff;
        }
        #section-p_secondary_sidebar *{
            color: #fff;
        }
        #section-p_secondary_sidebar .section{
            background: var(--accent-color-1)
        }
        .block-1637908213588{
            background: var(--accent-color-2) !important;
        }`
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--accent-color-1) !important')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },
            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .nblock-outline{\n--text-color-1 : #fff;\n--text-color-2: #fff;--accent-color-1: #fff;\n}#section-p_secondary_sidebar *{color: #fff;}",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }

    evLife() {
        $('.dynamic_styles').html('')
        //setColors('#7acbe6', '#7acbe6', '', '', '#7acbe6', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/SJm6QneLRdakcNco3Zsl_Repeat_Grid_1.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/ZkiJLESZTbyxDph5ErTC_adult-children-hands-holding-paper-family-cutout.jpg'
        this.backgroundImages(topImg, '400px', bottomImg, 'auto')

        if (isDemo) {
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/YfBJuxJcQ7q5ztTj1bQk_still-life-sustainable-lifestyle-elements-composition.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/gqT8klE1TOuJvtems1Gj_environment-earth-day-hands-trees-growing-seedlings.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top:before{
                background: none;
            }.background-theme-image-top img {
                object-position: bottom; max-width: 60%; margin: 0 0 0 auto;
            } .background-theme-image-bottom img{
                width:100%; object-position: bottom
            }  @media (max-width: 768px){ 
                .background-theme-image-top, .background-theme-image-bottom {display: none;}
            }
            .block-post_horizontal_bar_downloads_85668{
                --text-color-1:#000;
                color:#000;
                --accent-color-1:#000;
            }
            .is_admin_true .commented a {
                color: #000 !important;
            }
            .is_admin_true .commented .comment-name {
                color: #000 !important;
            }
            .is_admin_true .commented {
                border: 2px solid #000 !important;
            }
            .comment-reply .commented{
                background: #fff !important;
            }
            `
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: rgb(255 255 255 / 30%) !important; backdrop-filter: blur(5px);')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:60%;\nmargin:0 0 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },

            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.background_color": "rgb(255 255 255 / 30%)",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .section{backdrop-filter: blur(5px);}",
                },
                "post_horizontal_bar_v2":{
                    "blocks.post_horizontal_bar_v2_downloads.style": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\n--text-color-1:#000;color:#000;--accent-color-1:#000;",
                },
                "comments_discovery_v1":{
                    "blocks.comments_discovery_v1_post_comments.style": "append|/* -- Custom Selectors --*/.comment-reply .commented{background: #fff}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }

    evMakeup(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#DB588F', '#DB588F', '', '', '#ffffff', '#FFFFFF', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/XYyjDHKBTIGjkSszeBTG_4338594.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/P3M6vBFaRvKpI1bujR7O_various-cosmetics-types-scattered-table.jpg'
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')

        if (isDemo) {
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/3biICqfsTLWwbsChFDFN_young-woman-beauty-concept-with-orchid-flower.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/DsMS7rYkTu6ASuAGweRA_beautiful-woman-with-perfect-make-up-manicure-wearing-jewellery.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top:before{
            background: none;
        }.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:60%; object-position: bottom; margin: 0 0 0 auto;}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}}
    
        `
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: rgb(255 255 255 / 60%) !important; backdrop-filter: blur(10px);')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:60%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },

            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--accent-color-1",
                    "settings.background_color": "rgb(255 255 255 / 60%)",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .section{backdrop-filter: blur(10px);}",
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }

    evNutrition(isDemo) {
        $('.dynamic_styles').html('')
        $('#section-p_secondary_sidebar').removeClass('dark')
        //setColors('#F47656', '#F47656', '', '', '#ffffff', '#F7CD7E', '', '', '#000000', '#777777')
        this.contentTopBottomPadding('220px', '400px')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/MLK6sd8rS2e9dJJ8quGO_3762916.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/PpXmVu3dRqGBmuoqI8JA_vegetables-close-up-with-space-text.jpg'
        this.backgroundImages(topImg, 'auto', bottomImg, 'auto')

        if (isDemo) {
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/G2FKKv9LTHqvZ8tlHcEi_healthy-balanced-vegetarian-food-top-view.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/c6CldTH9SVCet1jUXi60_attractive-caucasian-woman-is-cooking-healthy-salad-beautiful-mulatto-woman-is-looking-her-dressed-silky-nightgown-modern-designed-kitchen.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top:before{
            background: none;
        }.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom; margin: 0 0 0 auto;}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}}
    
        `
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--bg-color-2) !important;')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n",
            },

            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--bg-color-2",
                    "settings.background_color": "",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .outline-post-wrap.active .outline-title span{color: var(--text-color-1) !important;}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }

    evStock(isDemo) {
        $('.dynamic_styles').html('')
        $('#section-p_secondary_sidebar').removeClass('dark')
        this.contentTopBottomPadding('220px', '400px')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/9XJMUQnSs6fljL4LUq2r_futuristic-concept-global.jpg'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/AjsA0amoTxid3MBEwsVL_stock-market-forex-trading-graph.jpg'
        this.backgroundImages(topImg, '400px', bottomImg, '400px')

        if (isDemo) {
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/hSd3a3GQl2i08FXKV1ET_4112552.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/zExSw0GRRuGQ1QNe8HDf_business-man-holding-financial-pen-chart-writing-finance-market-investment-stock-growth-technology-exchange-graph-analysis-success-background-with-economy-profit-digital-data-money-concept.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom; margin: 0 0 0 auto;}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}}
        #section-p_secondary_sidebar{
            color: #111;
            --text-color-1 : #111;
        }
        .nblock-outline{
            --text-color-1 : #111;
            --text-color-2: #111;
        }
        .post_sidebar_section{
            --text-color-1: #000;
            color: #000;
        }
        .post_sidebar_section .p1_btn, .nblock-post_completed_button, .nblock-post_favorite_button{
            --text-color-1: #fff;
        }
        #section-comments_discovery_v1 .section .is_admin_true .commented {
            background: var(--accent-color-2);
        }
        `
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--bg-color-2) !important;')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}",
            },

            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--bg-color-2",
                    "settings.background_color": "",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .active .outline-bullets {background: var(--accent-color-2) !important} \n#this-section .completed .outline-bullets{background: var(--accent-color-2) !important} #this-section .outline-post-wrap.active .outline-title span{color: var(--text-color-1) !important;}#section-p_secondary_sidebar{color: #111;--text-color-1 : #111;} .nblock-outline{--text-color-1 : #111;--text-color-2: #111;}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                'post_sidebar_discovery_v1':{
                    "settings.section_style": "append|/* -- Custom Selectors --*/\n#this-section{\n--text-color-1: #000;color:#000\n}\n#this-section .post_sidebar_section .p1_btn{\n--text-color: #fff}",
                    "blocks.post_sidebar_discovery_v1_post_playlist.style": "append|/* -- Custom Selectors --*/\n.dark .media h2{color: #fff}",
                    "blocks.post_sidebar_discovery_v1_post_completed_button.style": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\n--text-color-1:#fff;",
                    "blocks.post_sidebar_discovery_v1_post_favorite_button.style": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\n--text-color-1:#fff;"
                },
                "comments_discovery_v1": {
                    "settings.section_style": "append|/* -- Custom Selectors --*/#this-section .section .is_admin_true .commented {background: var(--accent-color-2);}"
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }


    evPhoto(isDemo) {
        $('.dynamic_styles').html('')
        //setColors('#FE3C92', '#F47656', '', '', '#1F282D', '#292F35', '', '', '#ffffff', '#ffffff')
        this.contentTopBottomPadding('350px', '400px')
        let topImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149314219/settings_images/zz8UFapXRpmRripuOx2K_ptg-top.png'
        let bottomImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/ilTyRQd1QihaT7ck3pk1_06_camera_santa_hat_gifts.png'
        this.backgroundImages(topImg, '450px', bottomImg, 'auto')

        if (isDemo) {
            var heroResumeImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/SDdWZObRtSI49FvfhOQA_detail-view-young-man-eyeglasses-taking-photos-street.jpg'
            $('div[d_id="hero_resume_evolution|20"] section').css('background-image', 'url(' + heroResumeImg + ')')
            var lessonBannerImg = 'https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/qRE6Bi6DRJCT3Cfd5hpa_top-view-hands-holding-camera-with-copy-space.jpg'
            $('div[d_id="lesson_banner_evolution|20"] section').css('background-image', 'url(' + lessonBannerImg + ')')

            let st = `.background-theme-image-top:before,.background-theme-image-bottom:before{background: none;}.background-theme-image-top img {object-position: bottom; max-width: 100%; margin: 0 auto 0 auto;} .background-theme-image-bottom img{width:100%; object-position: bottom; margin: 0 0 0 auto;}  @media (max-width: 768px){ .background-theme-image-top, .background-theme-image-bottom {display: none;}}
        .content{
            --text-color-1: #fff;
        }
        .p_contant_out:before {
            content: '';
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            background: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/0Ft5UlJSQnyh48jsOcOa_Repeat_Grid_1.png);
            background-size: cover;
        }
        `
            $('.dynamic_styles').append(st);
            $('#section-p_secondary_sidebar .section').attr('style', 'background-color: var(--bg-color-2) !important;')
        }
        // --  json  -----
        var appendObj =
        {
            "theme_settings":
            {
                "background_images_style": "/* -- Custom Selectors --*/\n\n\n.p_contant_out:before {\ncontent: '';\nwidth: 100%;\nheight: 100%;\nposition: absolute;\ntop: 0;\nleft: 0;\nbackground: url(https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2149752598/settings_images/0Ft5UlJSQnyh48jsOcOa_Repeat_Grid_1.png);\nbackground-size: cover;\n}\n.background-theme-image-top img{\nobject-position:bottom;\nmax-width:100%;\nmargin:0 auto 0 auto;\n}\n\n.background-theme-image-bottom img{\nobject-position:bottom;width:100%;\nmargin-left:auto;\n}\n/* -- Custom-Selectors Mobile --*/\n.background-theme-image-top, .background-theme-image-bottom{\ndisplay:none;\n}\n.content{--text-color-1: #fff;}",
            },

            "sections": {
                "p_secondary_sidebar": {
                    "settings.background_color_preset": "--bg-color-2",
                    "settings.background_color": "",
                    "blocks.secondary_sidebar_evolution_1_all_categories.style": "append|/* -- Custom Selectors --*/#this-block{background: var(--accent-color-2);}",
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-section .active .outline-bullets {background: var(--accent-color-2) !important} #this-section .completed .outline-bullets{background: var(--accent-color-2) !important} #this-section .outline-post-wrap.active .outline-title span{color: var(--text-color-1) !important;}"
                },
                "hero_resume_evolution": {
                    "settings.bg_image": heroResumeImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
                "lesson_banner_evolution": {
                    "settings.bg_image": lessonBannerImg.replace("https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/", "")
                },
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

        //html

    }
}



//console.log('layout_helpers')

JTB_baseThemeName = 'base_theme'
JTB_playlistIsBlock = false
JTB_overwrite = {}
JTB_ProgressOverwrites = {}
JTB_BadgeOverwrites = {}
JTB_TabsOverwrites = {}
JTB_outlineName = ''
JTB_outlineOverwrites = {}
JTB_playlistOverwrites = {}
JTB_playlistName = ''
JTB_headerOverwrites = {}
JTB_headerName = ''

class Layout {
    dashboardDefaultLayout() {
        this.setMainBar('main_sidebar_discovery_1')
        SIDEBARS.setSecondBar('secondary_sidebar_discovery_1')

        var appendObj = ''
        this.JTB_append(appendObj, JTB_overwrite)
        $('.background-theme-image-top').attr('style', 'display: none')
        $('.background-theme-image-bottom').attr('style', 'display: none')
        this.setThemeTypeClass('discovery')
    }

    resetJTB() {
        JTB_baseThemeName = 'base_theme'
        JTB_playlistIsBlock = false
        JTB_overwrite = {
            "setStaticSections": {},
            "sections": {}
        }
    }

    setMainBar(sectionName) {
        let text = DYNAMIC_SECTIONS.replaceBeforeAddingSection(MHTML.sections[sectionName])
        text = text.replaceAll("section-p_secondary_sidebar", "section-p_main_sidebar")
        let $newSection = $(text)
        $newSection.attr('not-dirty', 'true').attr('data-section-id', 'p_main_sidebar')
        $('.main_sidebar_wrap').html($newSection)
        JTB_overwrite.setStaticSections = {
            ...JTB_overwrite.setStaticSections,
            "p_main_sidebar": sectionName
        }
    }

    changeOutline(selectedOutline) {
        if (selectedOutline == 'Hide') {
            $(".nblock-outline").hide()
            $('.block-1637908664883').hide()
            $('.block-1645169001417').hide()
            $('.block-1637908664883').parent(".section-clmn-1").hide()
            //  add json  remove block 
            JTB_outlineOverwrites = {
                "hidden": "true"
            }
            var appendObj = ''

            if ($('.section').has('#block-1637908664883').length !== 0) {
                appendObj = {
                    "sections": {
                        "p_secondary_sidebar": {
                            "remove_block": "secondary_sidebar_evolution_1_heading",
                            "settings.clmn_style_1": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\nmin-height: 0;"
                        }
                    }
                }
            }

            this.JTB_append(appendObj, JTB_overwrite)
        } else {
            if (selectedOutline == "none") {
                selectedOutline = 'outline_discovery_2'
                JTB_outlineOverwrites = {
                    "progress_type": "none"
                }
            }
            $('.block-1637908664883').parent(".section-clmn-1").show()
            $('.block-1637908664883').show()
            $('.block-1645169001417').show()
            $('.nblock-outline').replaceWith(MHTML.blocks[selectedOutline])
            JTB_outlineName = selectedOutline

            $('[kjb-settings-id]').removeAttr('kjb-settings-id')
        }
        DEMO['outline_name'] = selectedOutline
    }

    setLayoutAndPlaylistToDefault() {
        JTB_ProgressOverwrites = {}
        JTB_BadgeOverwrites = {}
        JTB_TabsOverwrites = {}
        let fistVal = $('.select_outline option:nth-child(1)').attr('value')
        $('.select_outline').val(fistVal)
        JTB_outlineName = fistVal
        JTB_outlineOverwrites = {}
        fistVal = UCODE.code2playlist[SIDEBAR_SETTINGS.post.playlist]
        JTB_playlistOverwrites = {}
        JTB_playlistName = fistVal
        JTB_headerOverwrites = {}
        fistVal = UCODE.code2headers[SIDEBAR_SETTINGS.dashboard.header]
        JTB_headerName = fistVal
        fistVal = $('.select_color_mode option:nth-child(1)').attr('value')
        $('.select_color_mode').val(fistVal)
        COLORS.JTB_colorMode = 'White Mode'
        COLORS.setRgbaVars()

        $('.dynamic_styles,.progress_styles').html('')
        $('.background-theme-image-top,.background-theme-image-bottom,.main-content').attr('style', '')
        $('.background-theme-image-top .nimage,.background-theme-image-bottom .nimage').attr('src', '')
        $('body').attr('class', '')

        $('.top_padding_dashboard input').val('0')
        $('.top_padding_post input').val('0')

    }


    setContentSections(sections) {
        $('div[data-dynamic-sections]').html('')
        $('div[data-dynamic-sections]').siblings().html('')
        var cnt = 1
        var dId = ''
        var sectionRi = []
        var sectionName = ''
        for (var section of sections) {
            dId = section
            sectionName = section
            sectionRi = section.split('|')
            if (sectionRi.length > 1) {
                sectionName = sectionRi[0]
            }

            let text = MHTML.sections[sectionName]
            text = text.replace(/rykrvj3o6k/g, '42isirdu7n')
            text = text.replace(/yaron zeltzer/g, 'Jeff Lorem')
            text = text.replace(/7zaabl7v7i/g, 'c1ludijve5')

            text = text.replace('Review or reply user answers','Review or reply to user answers')
            text = text.replace('Content Management Page','Comment Management Page')
            text = text.replace('<p>Related Lessons</p>','<p>Related Lessons</p>Control which videos(lessons) are showing in the slider for each individual post, using tags and custom fields, or show automatically matched tags.')
            

            let $newSection = $(text)
            $newSection = this.replaceDynamicSectionBlockIds($newSection)
            $newSection.attr('d_id', section).attr('not-dirty', 'true')

            if (sectionName == 'post_chat'){
                var tmp_html = $newSection.html()
                tmp_html = tmp_html.replace(/element.insertAdjacentHTML/g,'//element.insertAdjacentHTML')
                $newSection.html($(tmp_html))
                
            }

            $('div[data-dynamic-sections]').append($newSection)
            if (IsR2) {
                let st = `<div class="dynamic_sections_item_wrap" d_id="` + section + `">
                <span>`+ sectionName + `</span>              
                <div class="dynamic_sections_item_icons">
                <div class="dynamic_sections_item_remove"><svg xmlns="http://www.w3.org/2000/svg" width="14.517" height="16" viewBox="0 0 14.517 16">
                <g id="Group_936" data-name="Group 936" transform="translate(-184.246 -778.25)">
                    <path id="Vector" d="M14,2.96c-1.2-.119-2.4-.208-3.6-.275V2.678l-.164-.967C10.126,1.027,9.963,0,8.222,0H6.273C4.54,0,4.376.982,4.257,1.7L4.1,2.656c-.692.045-1.384.089-2.075.156L.508,2.96a.557.557,0,1,0,.1,1.108L2.13,3.92A59.305,59.305,0,0,1,13.9,4.076h.06a.563.563,0,0,0,.558-.506A.57.57,0,0,0,14,2.96Z" transform="translate(184.246 778.25)" fill="#ff5858"/>
                    <path id="Vector-2" data-name="Vector" d="M11.01.29A.94.94,0,0,0,10.333,0H.931A.928.928,0,0,0,.254.29.958.958,0,0,0,0,.989L.463,8.621c.082,1.131.186,2.544,2.782,2.544H8.02c2.6,0,2.7-1.406,2.782-2.544L11.263,1A.964.964,0,0,0,11.01.29ZM6.867,7.438H4.39a.558.558,0,0,1,0-1.116H6.867a.558.558,0,0,1,0,1.116Zm.625-2.975H3.773a.558.558,0,1,1,0-1.116H7.492a.558.558,0,1,1,0,1.116Z" transform="translate(185.869 783.085)" fill="#ff5858"/>
                </g>
                </svg>
                </div>
                <div class="dynamic_sections_item_handle"><i class="fas fa-bars"></i></div>
                    </div>
            </div>`
                $('.dynamic_sections_wrap_inner').append(st)
            }
            cnt++
        }


        //json
        if (PAGE == HOMEPAGE) {
            var dynamicKey = "content_for_index"
        }
        if (PAGE == 'post') {
            var dynamicKey = "content_for_post"
        }
        if (PAGE == 'categories') {
            var dynamicKey = "content_for_categories"
        }
        if (PAGE == 'rsearch') {
            var dynamicKey = "content_for_search"
        }
        JTB_overwrite[dynamicKey] = sections
    }


    replaceDynamicSectionBlockIds($section) {
        var randPostfix = 99999 + Math.floor(Math.random() * 99999);
        $section.find('.nblock').each(function () {
            var blockId = $(this).attr('id')
            if ($(this).hasClass('nblock-container')) {
                return true
            }
            var newBlockId = blockId + '_' + randPostfix
            $(this).find('style').each(function () {
                var styleSt = $(this).html()
                var reBlockId = new RegExp(blockId, "g");
                styleSt = styleSt.replace(reBlockId, newBlockId)
                $(this).html(styleSt)
            })
            $(this).attr('id', newBlockId)
        })

        return $section
    }
    //



    JTB_append(appendObj, obj2overWrite) {
        this.JTBappendHelper(appendObj, obj2overWrite, "theme_settings")
        this.JTBappendHelper(appendObj, obj2overWrite, "sections")
        if (appendObj.sections == undefined) { return }
        for (var k of Object.keys(appendObj.sections)) {
            this.JTBappendHelper(appendObj.sections, obj2overWrite.sections, k)
        }
    }

    JTBappendHelper(appendObj, obj2overWrite, parentKey) {
        if (appendObj[parentKey] != undefined) {
            if (obj2overWrite[parentKey] == undefined) {
                obj2overWrite[parentKey] = appendObj[parentKey]
            } else {
                for (var childKey of Object.keys(appendObj[parentKey])) {
                    if (parentKey == 'sections' && obj2overWrite[parentKey][childKey] != undefined) { continue }
                    obj2overWrite[parentKey][childKey] = appendObj[parentKey][childKey]
                }
            }
        }
    }

    setThemeTypeClass(themeType) {
        $('.p_wrap_out').removeClass('discovery').removeClass('explorer').removeClass('curiosity').removeClass('evolution')
        $('.p_wrap_out').addClass(themeType)
        // $('.content > div > div:first-child > section').addClass('product-banner')
        if(themeType == 'curiosity' || themeType == 'evolution'){
            DEMO.dev = 'CCt'
        } else{
            DEMO.dev = 'CCf'
        }
        var appendObj =
        {
            "theme_settings":
            {
                "theme_type": themeType,
            }
        }
        this.JTB_append(appendObj, JTB_overwrite)
    }

}


LAYOUT_PRESETS = [
    ['Layout 1', {settings:'MSt-MPl-SSt-SFr-SPr-OTd1-OSf-PBh-PSs', tp: 0, }, '/layouts/1.jpg'],
    ['Layout 2', {settings:'MSf-MPl-SSt-SFf-SPl-OTe2-OSf-PBh-PSs', tp:80}, '/layouts/2.jpg'],
    ['Layout 3', {settings:'MSt-MPl-SSf-SFr-SPl-OTe2-OSf-PBh-PSs', tp:0}, '/layouts/3.jpg'],
    ['Layout 4', {settings: 'MSf-MPl-SSt-SFr-SPl-OTe2-OSf-PBh-PSs', tp: 30}, '/layouts/4.jpg'],
    ['Layout 5', {settings:'MSf-MPl-SSt-SFf-SPr-OTe2-OSf-PBh-PSs', tp:300}, '/layouts/5.jpg'],
    ['Layout 6', {settings: 'MSf-MPl-SSt-SFr-SPr-OTe2-OSf-PBh-PSs', tp: 30}, '/layouts/6.jpg'],
    ['Layout 7', {settings: 'MSt-MPr-SSf-SFr-SPr-OTe2-OSf-PBh-PSs', tp:0}, '/layouts/7.jpg'],
    ['Layout 8', {settings:'MSt-MPr-SSt-SFr-SPl-OTe2-OSf-PBh-PSs', tp:0}, '/layouts/8.jpg']
];

POST_PRESETS = [
    ['Post 1', 'HMt-SMt-APr-RFf-PLd-PId-HBf', '/post_layout/1.jpg'],
    ['Post 2', 'HMf-SMt-APh-RFf-PLn-PId-HBf', '/post_layout/2.jpg'],
    ['Post 3', 'HMt-SMt-APr-RFf-PLh-PId-HBf', '/post_layout/3.jpg'],
    ['Post 4', 'HMf-SMt-APr-RFf-PLd-PId-HBf', '/post_layout/4.jpg'],
    ['Post 5', 'HMf-SMt-APb-RFf-PLh-PId-HBf', '/post_layout/5.jpg'],
    ['Post 6', 'HMt-SMt-APb-RFf-PLh-PId-HBf', '/post_layout/6.jpg'],
    ['Post 7', 'HMt-SMt-APr-RFf-PLl-PId-HBf', '/post_layout/7.jpg'],
    ['Post 8', 'HMf-SMf-APb-RFf-PLh-PId-HBf', '/post_layout/8.jpg']
]

//console.log('miniFunctions')

class MiniFuncs {
    constructor() {
        this.mf_ucode = {
            'mbca': 'mfBulletColorAccent',
            'mrtp': 'mfRemoveTopPadding',
            'tob': 'mfTranslucentOutlineBg',
            'chb': 'mfChangeHeroBg',
            'cbc': 'mfChangeButtonColors',
            'hvml': 'mfHeroVideoMarginLeft',
            'adb': 'mfAnnouncment1AarkBg',
            'sabw': 'mfSidebarAnnouncmentBannerWhiteBg',
            'ftb': 'mfFaqTransparentBg',
            'mhl': 'mfHeaderLinks',
            'hc3r':'herocCriosity3Round'
        }
    }

    loadUrlMiniFunctions() {
        var mf = ROUTER.urlParm('mf')
        if (mf) {
            DEMO.miniFunctions = mf
            let funcs = mf.split('-')
            for (var func_code of funcs) {
                if (this.mf_ucode[func_code] != undefined) {
                    try {

                    } catch (e) {
                        //console.log('Problem with mini function ' + func_code)
                    }
                    this[this.mf_ucode[func_code]]();
                } else {
                    //console.log('mini function not in ucode - ' + func_code)
                }
            }
        }
    }


    mfBulletColorAccent() {
        var st = `
         #block-p_secondary_sidebar_outline_3_38413 .completed .outline-bullets{
             background: var(--accent-color-1) !important;
         }
         #block-p_secondary_sidebar_outline_3_38413 .outline-bullets{
            border-color: var(--accent-color-1) !important;
        }
        #block-p_secondary_sidebar_outline_3_38413 .active .outline-bullets{
            background: var(--accent-color-2) !important;
        }
        #block-p_secondary_sidebar_outline_3_38413 .product-outline-favorite.favorited{
            color: var(--accent-color-1) !important;
        }
         `
        let style = `
         #this-block .completed .outline-bullets{
             background: var(--accent-color-1) !important;
         }
        #this-block .outline-bullets{
            border-color: var(--accent-color-1) !important;
        }
        #this-block .active .outline-bullets{
            background: var(--accent-color-2) !important;
        }
        #this-block .product-outline-favorite.favorited{
            color: var(--accent-color-1) !important;
        }
        `
        $('.dynamic_styles').append(st)
        JTB_outlineOverwrites = {
            "style": "append|" + style
        }
    }

    mfRemoveTopPadding() {
        $('.content.col-md-8>div>div:nth-child(1) .sizer').attr('style', 'padding-top: 0')
        var sectionName = $('.content.col-md-8>div>div:nth-child(1)').attr('d_id')
        if (sectionName == undefined) { return; }
        sectionName = sectionName.split('|')[0]
        var appendObj = ''
        appendObj = {
            "sections": {
                [sectionName]: {
                    "settings.padding_desktop.top": "0"
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }


    mfTranslucentOutlineBg() {
        $('#section-p_secondary_sidebar .section').attr('style', 'background-color: rgb(255 255 255 / 30%) !important; backdrop-filter: blur(5px);')
        var appendObj = {
            "sections": {
                "p_secondary_sidebar": {
                    "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .section{background-color: rgb(255 255 255 / 30%) !important; backdrop-filter: blur(5px);}",
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

    mfChangeHeroBg() {
        $('section[data-iname = "hero resume discovery 4"] .section-clmn-1').attr('style', 'background: rgb(0 0 0 / 70%)')
        var appendObj = ""
        if ($('.content').has('section[data-iname = "hero resume discovery 4"]').length !== 0) {

            appendObj = {
                "sections": {
                    "hero_resume_discovery_4": {
                        "settings.section_style": "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/ #this-section .section-clmn-1{background: rgb(0 0 0 / 70%) !important}"
                    }
                }
            }
        }

        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

    mfChangeButtonColors() {
        $('section[data-iname = "hero resume discovery 3"] a span').attr('style', 'color: #000000;')
        $('.block-secondary_sidebar_discovery_v1_all_categories_38745').attr('style', 'color: #000000;')
        $('.block-secondary_sidebar_discovery_v1_banner_button_11308 span').attr('style', 'color: #000000;')
        $('.toggle-sidebar').attr('style', 'color: #000000;')
        var appendObj = { "sections": {} }
        if ($('.content').has('section[data-iname = "hero resume discovery 3"]').length !== 0) {
            var appendObj1 = {
                "hero_resume_discovery_3": {
                    "blocks.hero_resume_discovery_3_button.cta_color": "#000000"

                }
            }
        }
        if ($('.sidebar').has('.block-secondary_sidebar_discovery_v1_all_categories_38745').length !== 0) {

            var appendObj2 = {
                "blocks.secondary_sidebar_discovery_1_all_categories.style": "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\ncolor: #000000 !important;\n",
            }
        }
        if ($('.sidebar').has('.block-secondary_sidebar_discovery_v1_banner_button_11308').length !== 0) {

            var appendObj3 = {
                "blocks.secondary_sidebar_discovery_1_banner_button.cta_color": "#000000",
            }
        }

        appendObj = {
            "sections": {
                ...appendObj1,
                "p_secondary_sidebar": {
                    ...appendObj2,
                    ...appendObj3
                },
                "p_main_sidebar": {
                    "settings.clmn_style_1": "append|/* -- Custom Selectors --*/\n  .toggle-sidebar{color: #000}"
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

    mfHeaderLinks() {
        var links = [
            {
                "title": "Dashboard",
                "src": "#"
            },
            {
                "title": "Search",
                "src": "#"
            },
            {
                "title": "Program 1",
                "src": "#"
            },
            {
                "title": "Program",
                "src": "#"
            }
        ]
        $("#section-p_header .dashboard-tabs").html('')
        links.forEach((link, i) => {
            var st = `<a href="${link.src}" class="dashboard-tabs-tab hide-false">${link.title}</a>`
            $("#section-p_header .dashboard-tabs").append(st)
        })
    }
    mfHeroVideoMarginLeft() {
        var st = `
         section[data-iname="video banner discovery 1"]{
            margin-left: 28px;
         }
         `
        $('.dynamic_styles').append(st)
        var appendObj = ""
        if ($('.content').has('section[data-iname="video banner discovery 1"]').length !== 0) {
            appendObj = {
                "sections": {
                    "video_banner_discovery_1": {
                        "settings.section_style": "append|/* -- Custom Selectors --*/ #this-section .section{margin-left: 28px;}"
                    }
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)

    }

    mfAnnouncment1AarkBg() {
        var st = `
        #section-dashboard_announcement_discovery_2 .section-clmn.section-clmn-2{
            background: #1c1c1c !important;
         }
         `
        $('.dynamic_styles').append(st)
        var appendObj = ""
        if ($('.content').has('section[data-iname="dashboard announcement discovery 2"]').length !== 0) {
            appendObj = {
                "sections": {
                    "dashboard_announcement_discovery_2": {
                        "settings.section_style": "append|/* -- Custom Selectors --*/ #this-section .section-clmn.section-clmn-2{background-color: #1c1c1c !important}"
                    }
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

    mfSidebarAnnouncmentBannerWhiteBg() {
        var st = `
        #section-p_secondary_sidebar .section-clmn.section-clmn-3{
            background: #dfdfdf !important;
         }
         `
        $('.dynamic_styles').append(st)

    }


    mfFaqTransparentBg() {
        var st = `
        section[data-iname="discovery 1 faq"]{
            background: transparent !important;
         }
         `
        $('.dynamic_styles').append(st)
        var appendObj = ""
        if ($('.content').has('section[data-iname="discovery 1 faq"]').length !== 0) {
            //console.log("faq")
            appendObj = {
                "sections": {
                    "discovery_1_faq": {
                        "settings.background_color_preset": "No Background Color"
                    }
                }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

    herocCriosity3Round() {
        $('.nsection[data-iname="hero resume curiosity 3"]').css('border-radius','8px').css('overflow','hidden')
        $('.nsection[data-iname="hero curiosity 2"]').css('border-radius','8px').css('overflow','hidden')
        $('.nsection[data-iname="hero resume discovery 4"]').css('border-radius','8px').css('overflow','hidden')
        
        $('.nsection[data-iname="hero resume discovery 3"] .elm_type_post_category  ').css('background','var(--accent-color-2)')
        
    }
    
    
}


class Post {
    updatePostSettings() {
        var sbText = ROUTER.urlParm('ps')
        var sbAttr, sb_val = ''
        if (sbText) {
            DEMO.postSettings = sbText
            // if (PAGE != 'post') { return }
            for (var item of sbText.split('-')) {
                sbAttr = item.substring(0, 2)
                var sbVal = item.substring(2)
                //console.log(item)
                if (sbAttr == 'HM') {
                    this.toggleMBarOnPost(sbVal)
                }
                else if (sbAttr == 'SM') {
                    this.toggleSBarOnPost(sbVal)
                }
                else if (sbAttr == 'PL') {
                    this.changePlaylist(UCODE.code2playlist[sbVal])
                }
                else if (sbAttr == 'AP') {
                    this.postActionBarPosition(UCODE.code2pBarPosition[sbVal])
                }
                else if (sbAttr == 'RF') {
                    this.postSidebarStyle(sbVal)
                }
                else if (sbAttr == 'MP') {
                    this.mainBarPositionOnPost(sbVal)
                }
                else if (sbAttr == 'SP') {
                    this.sBarPositionOnPost(sbVal)
                }
            }
        } else{
            DEMO.postSettings = 'HMf-SMt-APr-RFr-PLd-PId-HBf-MPl-SPr'
        }
        
        this.loadUrlTopPaddingPost()
    }


    loadUrlTopPaddingPost(){
        var contentTopPaddingPost = ROUTER.urlParm('pp')
        if (contentTopPaddingPost){
            DEMO.contentTopPaddingPost = contentTopPaddingPost
            var padding = contentTopPaddingPost
        } else{
            var padding = "0"
        }
        this.changePostContentPadding(padding)
    }

    postLayoutSelected(url, topPadding){
        DEMO.postSettings = url
        DEMO.postTopPadding = topPadding
        this.changePostContentPadding(topPadding)
        ROUTER.setUrl()
        this.updatePostSettings()

        TOPBAR.changed('change_post_layout')
    }

    mainBarPositionOnPost(val) {
        var position = 'l'
        var appendObj = {}
        if (val == 'd') {
            if ($('.p_wrap_out').hasClass('mp-Right')) {
                position = 'r'
            }
        } else {
            position = val
        }
        if (position == "r") {
            if (PAGE == 'post') {
                $('.toggle-sidebar').attr('style', 'left: auto !important;')
                $('.p_wrap_out').removeClass('main_sidebar_post_position-Left').addClass('main_sidebar_post_position-Right')
            }
            appendObj = {
                "sections": { "p_main_sidebar": { "settings.post_position": "Right" } }
            }
        }
        else {
            if (PAGE == 'post') {
                $('.toggle-sidebar').css('left',"")
                $('.p_wrap_out').removeClass('main_sidebar_post_position-Right').addClass('main_sidebar_post_position-Left')
            }
            appendObj = {
                "sections": { "p_main_sidebar": { "settings.post_position": "Left" } }
            }
            
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }
    sBarPositionOnPost(val) {
        var appendObj = {}
        var position = 'r'
        if (val == 'd') {
            if ($('.p_wrap_out').hasClass('secondary_sidebar_position-Left')) {
                position = 'l'
            }
        } else {
            position = val
        }
        //console.log(position)
        if (position == "r") {
            if (PAGE == 'post') {
                $('.main-content .sidebar').css('order', '2').addClass('ssbar-right').removeClass('ssbar-left')
                $('.main-content .content').removeClass('content-right')
            }
            appendObj = {
                "sections": { "p_secondary_sidebar": { "settings.post_position": "Right" } }
            }
        }
        else {
            if (PAGE == 'post') {
                $('.main-content .sidebar').css('order', '0').addClass('ssbar-left').removeClass('ssbar-right')
                $('.main-content .content').addClass('content-right')
            }
            appendObj = {
                "sections": { "p_secondary_sidebar": { "settings.post_position": "Left" } }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }
    toggleMBarOnPost(val) {
        if ($('.toggle-sidebar').length == 0) {
            var btn = `
            <button class="toggle-sidebar"><i class="far fa-exchange"></i></button>
            `
            $('.p_wrap_out').prepend(btn)
        }
        var appendObj = {}
        if (val == 't') {
            if (PAGE == 'post') {
                $('.toggle-sidebar').hide()
                SIDEBARS.hideMainBarHtml()
                $('.main_sidebar_wrap').addClass('show-false')
            }
            appendObj = {
                "sections": {
                    "p_main_sidebar": {
                        "settings.show_sidebar_post": "false"
                    }
                },
                "theme_settings": {
                    "content_width_post": "1352px"
                }
            }
        } else if (val == 'f') {

            appendObj = {
                "sections": {
                    "p_main_sidebar": {
                        "settings.show_sidebar_post": "true"
                    }
                },
                "theme_settings": {
                    "content_width_post": "100%"
                }
            }
            if (PAGE == 'post') {
                 
                $('.p_outline_out').removeClass('close-sidebar')
                $('.main_sidebar_wrap').show()
                $('.main_sidebar_wrap').addClass('show-true')
                $('.main_sidebar_wrap').removeClass('show-false')
                $('.toggle-sidebar').show()
                $('.p_wrap_out').addClass('show_main_sidebar')
                $('.main-content-spacer, #section-p_header .sizer ').css('max-width', '100%')
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

    toggleSBarOnPost(val) {
        var appendObj = {}
        if (val == 't') {
            if (PAGE == 'post') {
                SIDEBARS.removeSecondBarHtml()
                $('.post_sidebar_section').attr("style", "display: block !important");
            }
            if (JTB_overwrite['sections'] == undefined) {
                JTB_overwrite['sections'] = {}
            }
            appendObj = {
                "sections": {
                    "p_secondary_sidebar": {
                        "settings.show_sidebar_post": "false",
                        "remove_block|1": "secondary_sidebar_evolution_1_post_completed_button",
                        "remove_block|2": "secondary_sidebar_evolution_1_post_downloads",
                        "remove_block|3": "secondary_sidebar_evolution_1_post_favorite_button"
                    }
                }
            }
        }
        else {
            if (PAGE == 'post') {
                SIDEBARS.showSecondarySidebar_html()
                $('.post_sidebar_section').attr("style", "display: none !important");
                $('.post_left').css('width', '100%');
            }
            appendObj = {
                "sections": {
                    "p_secondary_sidebar": {
                        "settings.show_sidebar_post": "true"
                    }
                }
            }
        }
        SIDEBAR_SETTINGS.post.showSecondarySidebar = val
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

    postSidebarStyle(val) {
        if (val == 'f') {
            var $newSection = $(MHTML.sections['post_sidebar_curiosity_3'])
            $newSection.attr('not-dirty', 'true')
            $('.post_sidebar_section').replaceWith($newSection)
        } else {
            var $newSection = $(MHTML.sections['post_sidebar_discovery_v1'])
            $newSection.attr('not-dirty', 'true')
            $('.post_sidebar_section').replaceWith($newSection)
        }
        if ($('.select_playlist').val() != 'playlist_discovery') {
        }
        SIDEBAR_SETTINGS.post.roundOrFlat = val
    }


    postActionBarPosition(val) {
        var sections = this.postPageSections()
        DEMO["post_sections"] = sections
        LAYOUT.setContentSections(sections)
        FEATURES.setTabsSections()
        FEATURES.changeSectionStyle($(".feature_posts > div.active"))
        if (val == 'below') {
            $('.select_playlist').val('playlist_horizontal_bg')
            $('.post_sidebar .nblock-post_playlist').remove()
            var appendObj = {
                "sections": {
                    "post_sidebar_discovery_v1": {
                        "remove_block": "post_sidebar_discovery_v1_post_playlist"
                    }
                },
            }
            LAYOUT.JTB_append(appendObj, JTB_overwrite)
        }

        SIDEBAR_SETTINGS.post.actionBarPosition = val
    }

    postPageSections() {
        var showSbar = false
        var psParms = ROUTER.urlParm('ps')
        var barPosition = 'r'
        var afterMediaSections = []
        if(DEMO.postSections){
            for(var post of DEMO.postSections.split("-")){
                afterMediaSections.push(UCODE.code2psection[post])
            }
        } else {
            afterMediaSections = [
            "post_action_mobile_discovery_v1",
            "post_tabs",
            "post_body_mobile_discovery_v1",
            "post_chat",
            "comments_discovery_v1",
            "post_questions",
            "post_user_notes",
            "post_related_posts"
            ]
            DEMO.postTabs = 'pb-pc-cd-pq-pn'
            DEMO.postSectionStyle = "c"
            var idx = 0 
            var postSecParams = ''
            for(var lesson of afterMediaSections){
                idx++
                postSecParams += `${UCODE.psection2code[lesson]}${idx != afterMediaSections.length ? "-" : ""}`
                
            }
            DEMO.postSections = postSecParams
            FEATURES.setTabsSections()
            ROUTER.setUrl()
            FEATURES.getSectionsFromUrl()
        }

        if(DEMO.postTabs){

            setTabsOrder()
            
            //console.log(DEMO.postTabs)
            var tabBlocks = {
                "pb": "post_tabs_lesson_info",
                "cd": "post_tabs_comments",
                "pc": "post_tabs_chat",
                "pn": "post_tabs_my_notes",
                "pq": "post_tabs_questions",
                "pr": "post_tabs_related_lessons"
            }
            var firstTabActive = `blocks.${tabBlocks[DEMO.postTabs.split("-")[0]]}.is_active`
            var hideOnMobile = {}
            for(var item of DEMO.postTabs.split("-")){
                if(item == "ds"){
                    hideOnMobile = {"settings.hide_on_mobile": "true"}
                    $("#section-post_tabs").addClass("hide_on_mobile")
                }
                delete tabBlocks[item]
            }
            //console.log(tabBlocks)
            var mobileOnlyTabs = {}
            var idx = 0
            for(i in tabBlocks){
                if(DEMO.postSections.includes(i)){
                    mobileOnlyTabs[`blocks.${tabBlocks[i]}.mobile_only`] = "true"
                } else{
                    mobileOnlyTabs[`remove_block|${idx}`] = tabBlocks[i]
                }
                
                idx++
            }
            if(JTB_overwrite['sections'] == undefined){
                JTB_overwrite['sections'] = {}
            }
            JTB_overwrite['sections']["post_tabs"] = {}
            var styleJson = `
            @media(max-width:768px){
                .r2-tab-data {
                    box-shadow: 1px -1px 6px 0px #d9d9d9;
                    padding-top: 33px;
                    padding-bottom: 17px;
                    margin-bottom: 50px !important;
                    border-radius: 3px;
                }                
            }
            `
            var appendObj = {
                "sections": {
                    "post_tabs": {
                        [firstTabActive]: "true",
                        ...mobileOnlyTabs,
                        ...hideOnMobile,
                        "settings.section_style": `append|${styleJson}`
                    }
                },
            }
            JTB_TabsOverwrites = appendObj
            LAYOUT.JTB_append(appendObj, JTB_overwrite)
            //console.log(JTB_overwrite)
            //console.log(JTB_TabsOverwrites)
        }
        if (psParms) {
            if (psParms.includes('SMt')) {
                showSbar = true
            }
            barPosition = psParms.split('-AP')[1].substring(0, 1)

            if (psParms.split('-RF')[1].substring(0, 1) == 'f') {
                barPosition = 'c'
            }
            if (psParms.split('-PL')[1].substring(0, 1) == 'h') {
                barPosition = 'g'
            }
            if (psParms.split('-PL')[1].substring(0, 1) == 'h' && psParms.split('-RF')[1].substring(0, 1) == 'f') {
                barPosition = 's'
            }
            if (psParms.split('-AP')[1].substring(0, 1) == 'h') {
                barPosition = 'h'
            }
            if (psParms.split('-PL')[1].substring(0, 1) == 'h' && psParms.split('-AP')[1].substring(0, 1) == 'b') {
                barPosition = 'b'
            }
            if (psParms.split('-PL')[1].substring(0, 1) == 'h' && psParms.split('-AP')[1].substring(0, 1) == 'b' && psParms.split('-RF')[1].substring(0, 1) == 'f') {
                barPosition = 'x'
            }
        }
        if (SIDEBAR_SETTINGS.post.showSecondarySidebar == 't' || $(".sidebar.col-md-4").css("display") == "none") {
            showSbar = true
        }
        var playlistBottom = 'playlist_horizontal_bg'
        if (playlistBottom == undefined) {
            playlistBottom = 'playlist_horizontal_bg'
        }
        if (barPosition == 'right' || barPosition == 'r') {
            var sections = [
                "post_media_discovery_v1",
                ...afterMediaSections
            ]
            showSbar && sections.unshift("post_sidebar_discovery_v1")
        }
        if (barPosition == 'c') {
            var sections = [
                "post_media_discovery_v1",
                ...afterMediaSections
            ]
            showSbar && sections.unshift("post_sidebar_curiosity_3")
        }
        if (barPosition == 'below' || barPosition == 'b') {
            var sections = [
                "post_media_discovery_v1",
                playlistBottom,
                ...afterMediaSections
            ]
            showSbar && sections.splice(3, 0, "post_sidebar_discovery_v1")
        }
        if (barPosition == 'x') {
            var sections = [
                "post_media_discovery_v1",
                playlistBottom,
                ...afterMediaSections
            ]
            showSbar && sections.splice(3, 0, "post_sidebar_curiosity_3")
        }
        if (barPosition == 'horizontal' || barPosition == 'h') {
            var sections = [
                "post_media_discovery_v1",
                "post_horizontal_bar_v2",
                ...afterMediaSections
            ]
        }
        if (barPosition == 'g') {

            var sections = [
                "post_media_discovery_v1",
                playlistBottom,
                ...afterMediaSections
            ]
            showSbar && sections.unshift("post_sidebar_discovery_v1")
        }
        if (barPosition == 's') {
            var sections = [
                //   "post_sidebar_curiosity_3",
                "post_media_discovery_v1",
                playlistBottom,
                ...afterMediaSections
            ]
            showSbar && sections.unshift("post_sidebar_curiosity_3")
        }
        return sections

    }

    changePlaylist(val) {

        if (val == 'playlist_none') {
            $('.nblock-post_playlist').html('')
            $('#section-playlist_horizontal_bg').remove()
        }
        else if (val == 'playlist_discovery' || val == 'playlist_large_thumbs' || val == 'playlist_curiosity_3') {
            var $newPlaylist = $(MHTML.blocks[val])
            $newPlaylist.attr('not-dirty', 'true')
            $('.nblock-post_playlist').replaceWith($newPlaylist)
            $('#section-playlist_horizontal_bg').remove()
            JTB_playlistIsBlock = true
        } else if (val == 'playlist_horizontal_bg') {
            $('.nblock-post_playlist').html('')
            var $newPlaylist = $(MHTML.sections[val])
            $newPlaylist.attr('not-dirty', 'true')
            if ($('#section-playlist_horizontal_bg').length == 0) {
                $('#section-post_media_discovery_v1').after($newPlaylist)
            } else {
                $('#section-playlist_horizontal_bg').replaceWith($newPlaylist)
            }
            JTB_playlistIsBlock = false
            var appendObj = {
                "sections": {
                    "post_sidebar_discovery_v1": {
                        "remove_block": "post_sidebar_discovery_v1_post_playlist"
                    },
                    "post_sidebar_curiosity_3": {
                        "remove_block": "post_sidebar_curiosity_3_post_playlist"
                    }
                },
            }
            LAYOUT.JTB_append(appendObj, JTB_overwrite)
        }


        $('.track__thumb,.media.track').css('border-radius', '0')
        $('.playlist__title').css('background', 'none')
        $('.playlist__title h2').css('color', 'var(--text-color-1)')
        JTB_playlistOverwrites = {
            "style": "append|#this-block .playlist__title{\nbackground: none;\n}\n\n#this-block .media h2{color: var(--text-color-1);}\n#this-block .track__thumb,#this-block .media.track\n{\nborder-radius: 0;}"
        }
        JTB_playlistName = val
        this.postSidebarPost()
        SIDEBAR_SETTINGS.post.playlist = val

    }

    postSidebarPost() {
        if (document.querySelector('.post_sidebar') == undefined) { return }
        var sidebarSection = document.querySelector('.post_sidebar').parentElement;
        if (sidebarSection.length != 0) {
            sidebarSection.closest('div[data-section-id]').setAttribute('class', 'post_sidebar_section')
            var sections = $('div[data-dynamic-sections] > div[data-section-id]')
            var dClass = "post_top"
            for (var section of sections) {
                if (section == sidebarSection) {
                    dClass = "post_left"
                    continue;
                }
                section.classList.add(dClass);
            }

        }
    }
    changePostContentPadding(val) {
        if(val){
            TOPBAR.changed('change_post_layout')

            if (PAGE == 'post') {
                var st = `
                .main-content-spacer{
                    padding-top: ${val}px !important
                }
                @media(max-width: 768px){
                    .main-content-spacer{
                        padding-top: 20px !important
                    }
                }
                `
                 $('.dynamic_styles').append(st)
            }
            DEMO['postTopPadding'] = val
            var appendObj = {
                "theme_settings": {
                    "content_top_padding_post": `${val}px`,
    
                }
            }
    
            $('.top_padding_post input').val(val)
    
            LAYOUT.JTB_append(appendObj, JTB_overwrite)
        } else{
            if(PAGE == "post"){
                var st = `
                .main-content-spacer{
                    padding-top: 0 !important
                }
                `
                $('.dynamic_styles').append(st)
            }
            var appendObj = {
                "theme_settings": {
                    "content_top_padding_post": `0px`,
    
                }
            }
    
            $('.top_padding_post input').val('0px')
    
            LAYOUT.JTB_append(appendObj, JTB_overwrite)
        }
    }



}


function setTabsOrder(){
    var r = []
    $('.post-section-sort').each(function (){
        if ($(this).find('input').is(':checked')){
            //console.log($(this).attr('data-name'))
            r.push($(this).attr('data-name'))
        }
    })
    JTB_overwrite['post_tabs_order'] = r 
}


PRODUCT_LAYOUT = `
<div class="p_wrap_out show_main_sidebar  main_sidebar_position-Left is_fixed_header" style="display: flex; width: 100%;">

    <style class="dynamic_styles"></style>
    <style class="sidebar_styles"></style>
    <style class="progress_styles"></style>

    <div class="background-theme-image-top">
        <img class="nimage" src="">
    </div>
    <div class="background-theme-image-bottom">
        <img class="nimage" src="">
    </div>

    <button class="toggle-sidebar">
        <i class="far fa-exchange"></i>
    </button>
    <div class="p_outline_out">
        <div class="main_sidebar_wrap show-true">
            
        </div>
    </div>
    <div class="p_contant_out" style="flex:1;">

        <div id="section-p_header" data-section-id="p_header" style="height: 84px;">
        
        </div>

  

        <div class="main-content col flex-fill">
            <div class="main-content-spacer" kjb-settings-id="show_dashboard">
                <div class="row main-content-inner">
            
                    <div class="sidebar col-md-4 ">
                        <div id="section-p_secondary_sidebar" data-section-id="p_secondary_sidebar">
                        
                        </div>
                    </div>

                    <div class="content col-md-8">
                        <div data-content-for-index data-dynamic-sections="index">
                
                        </div>
                    </div>

                </div>
            </div>
        </div>

    </div>
</div>`

//console.log('progress_blocks')


class Progress{

    constructor(){
        this.events()
        this.currentProgressBlockIndex = -1
        this.currentProgressBlockIndex_withClmns = -1
        this.setMainOrSecInput()
    }

    events(){   
        DEMO.progress = 'Avatar Basic'
        $("input:radio[name ='progress_main_or_sec']").click(function(e){
            e.stopPropagation()
            PROGRESS.progressRemove()
            PROGRESS.currentProgressBlockIndex = -1
            PROGRESS.currentProgressBlockIndex_withClmns = -1
            $("input:radio[name ='progress_main_or_sec']").prop('checked', false)
            $(this).prop('checked', true)
            PROGRESS.changeProgress(DEMO.progress)
        }) 
        $(".progress_btns > div").click(function(){
            $(".progress_btns > div").removeClass('active')
            $(this).addClass("active")
            PROGRESS.currentProgressBlockIndex = -1
            PROGRESS.currentProgressBlockIndex_withClmns = -1
            PROGRESS.changeProgress(DEMO.progress)
            var sidebarPosition = $(this).data('value')
            if(sidebarPosition == 'p_main_sidebar'){
                sidebarPosition = 'm'
            } else{
                sidebarPosition = 's'
            }
            DEMO['sidebars'] = DEMO.sidebars.replace(/PS./g, 'PS'+sidebarPosition)
            //console.log(DEMO.sidebars)
            ROUTER.setUrl()
        })
        $('.progress_positions > div > .progress-w').click(function(){
            PROGRESS.changeProgress($(this).attr('name'))
            DEMO.progress = $(this).attr('name')
            DEMO['sidebars'] = DEMO.sidebars.replace(/PB.+-/g, 'PB'+UCODE.progress2code[DEMO.progress]+'-')
            ROUTER.setUrl()
        }) 
    
    }

    setMainOrSecInput(){  
        var $progressBlock = $('.n_p_main_sidebar .nblock-p_user,.n_p_main_sidebar .nblock-p_user, .n_p_secondary_sidebar .nblock-course_progress,.n_p_secondary_sidebar .nblock-p_user')
        if ($progressBlock.length != 0){
            var fval =  $progressBlock.closest('section').attr('data-type')
            $(".progress_btns > div").removeClass("active")
        } else {
            if ($('.main_sidebar_wrap').hasClass('show-false')){
                var fval = 'p_secondary_sidebar'
            } 
        }
        $(".progress_main_or_sec_wrap input[value='" + fval + "']").prop("checked", true);
        $(".progress_btns > div[data-value='"+ fval +"']").addClass("active")
    }

    getCurrentProgressBlockIndex(){
        for (var sbar of ['main','secondary']){
            $('#section-p_'+sbar+'_sidebar .nblock').each(function (i){
                if ($(this).hasClass('nblock-p_user') || $(this).hasClass('nblock-course_progress')){  
                        PROGRESS.currentProgressBlockIndex = i
                        let clmnNumber = $(this).closest('.section-clmn').index()
                        PROGRESS.currentProgressBlockIndex_withClmns = i + clmnNumber + 1
                        return false
                }
            })
        }
    }

    changeProgress(progressType){
        TOPBAR.changed('progress')
        //console.log('progress bar change')
        this.progressRemove()
        this.getCurrentProgressBlockIndex()
        
        $('.progress_styles').html('');
    
        var selectedSidebar = $(".progress_btns > .active").data("value");
        DEMO.progress_sidebar = selectedSidebar
        if (progressType == 'Hide'){
            this.progressRemove('p_main_sidebar')
            this.progressRemove('p_secondary_sidebar')
        }
    
        if (progressType == 'Avatar Basic'){
            this.progressAddBlock(selectedSidebar,'user_progress_1')
            this.progressAvatarBasic(selectedSidebar)
        }
    
        if (progressType == 'No Avatar'){
            this.progressAddBlock(selectedSidebar,'user_progress_3')
            this.progressAvatarBasic(selectedSidebar)
            
        }
        if (progressType == 'No Avatar Light'){
            this.progressAddBlock(selectedSidebar,'user_progress_3')
            this.progressNoAvatarLight(selectedSidebar)
        }
    
        if (progressType == 'All Elements'){
            this.progressAddBlock(selectedSidebar,'user_course_progress_2')
            this.progressAddBlock(selectedSidebar,'user_progress_2')
            this.progressAllElements(selectedSidebar)
        }
    
        if (progressType == 'Columns'){
            this.progressAddBlock(selectedSidebar,'user_progress_4')
            this.progressColumns(selectedSidebar)
        }
        if (progressType == 'Columns Accent'){
            this.progressAddBlock(selectedSidebar,'user_progress_4')
            this.progressColumnsAccent(selectedSidebar)
        }
        if (progressType == 'Columns Light'){
            this.progressAddBlock(selectedSidebar,'user_progress_4')
            this.progressColumnsLight(selectedSidebar)
        }
        if (progressType == 'Columns Percent'){
            this.progressAddBlock(selectedSidebar,'user_progress_5')
            this.progressPercent(selectedSidebar)
        }
        
    }
    
    
    progressRemove(){
        $('#section-p_main_sidebar .nblock-p_user, #section-p_secondary_sidebar .nblock-p_user').remove()
        $('#section-p_main_sidebar .nblock-course_progress, #section-p_secondary_sidebar .nblock-course_progress').remove()
        JTB_ProgressOverwrites = { 'sections': {} }
    }
    
    
    progressAddBlock(sidebar,blockId){
        //console.log(sidebar)
        //console.log(blockId)
        //json
        var index = 2
        if (sidebar == 'p_main_sidebar'){
            index = 3
        }
        if (this.currentProgressBlockIndex != -1){
            index = this.currentProgressBlockIndex_withClmns
        }

        var jtbSection =  JTB_ProgressOverwrites.sections[sidebar]
        if (jtbSection == undefined){
            jtbSection = JTB_ProgressOverwrites.sections[sidebar] = {}
        }
        //console.log(index)
        let rndNum =  Object.keys(jtbSection).length
        jtbSection["add_block|"+rndNum] = 'index:'+index+'|' + blockId
    
    

        //html
        var blockHtml = $(MHTML.blocks[blockId])
        blockHtml.attr('block-id',blockId) 
        
        var numberOfblocks = $('#section-'+sidebar+' .section-clmn > .nblock').length
        if (numberOfblocks < index){
            index = numberOfblocks
        } 

        var index = 0
        if (sidebar == 'p_main_sidebar'){
            index = 2
        }
        if (this.currentProgressBlockIndex != -1){
            index = this.currentProgressBlockIndex
        }
        $('#section-'+sidebar+' .section-clmn > .nblock').each(function (i){
            if (index == 0){
                $(this).before(blockHtml)
                return  false
            }
            if (i+1 == index){
                $(this).after(blockHtml)
            }
        })
    }
    
    progressAvatarBasic(sidebar) {
        if (sidebar == 'p_secondary_sidebar') {
            var styleSt = `
            #section-p_secondary_sidebar .sizer{
                padding-top: 0px !important
            }
            `
        }
        $('.progress_styles').html(styleSt);
    }
    
    progressAllElements(sidebar) {
    
        if (sidebar == 'p_secondary_sidebar') {
            var styleSt = `
            [block-id='user_progress_2']{
                border-radius: 5px 5px 0 0;
            }
            #block-secondary_sidebar_discovery_v1_instructor_image_72219 img{
                aspect-ratio: 4/3 !important;
            }
            [block-id='user_course_progress_2']{
                border-radius: 0 0 5px 5px;
            }
            #block-secondary_sidebar_discovery_v1_instructor_image_72219{
                border-radius: 5px !important;
                max-width: 100% !important;
            }
            #section-p_secondary_sidebar .sizer{
                padding-top: 20px !important;
            }
            `
            
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_2.style|1"] = "replace|/* -- Desktop Style --*/, /* -- Desktop Style --*/\nborder-radius: 5px 5px 0 0;"
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_course_progress_2.style|2"] = "replace|/* -- Desktop Style --*/, /* -- Desktop Style --*/\nborder-radius: 0 0 5px 5px;"
    
            var sidebarIname = this.getSidebarIname(sidebar) 
    
            if (!sidebarIname.includes("discovery")){
                styleSt += `
                [block-id = 'user_progress_2'] {
                    margin: 10px 10px 0;
                }
                [block-id = 'user_course_progress_2'] {
                    margin: 0px 10px 10px;
                }
                #section-p_secondary_sidebar .sizer{
                    padding-top: 0px !important
                }`
                JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "0"
                JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_2.style|3"] = "append|#this-block{margin: 10px 10px 0;}"
                JTB_ProgressOverwrites.sections[sidebar]["blocks.user_course_progress_2.style|4"] = "append|#this-block{margin: 0px 10px 10px;}"
            }
            else{
                styleSt += `
                #section-p_secondary_sidebar .sizer{
                    padding-top: 20px !important
                }
                `
            }
    
        }
        else{
            var styleSt = `
            #block-1644990958229, #block-1645000906838{
                border-radius: 0;
            }
            `
        }
        $('.progress_styles').html(styleSt);
    
    
    }
    
    
    progressColumns(sidebar) {
    
        let st = "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\nborder-bottom: 1px solid #ccc;\nmargin-bottom: 30px;"
        JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_4.style|1"] = st 
    
        var styleSt = `
        #block-1646032283118 {
            padding: 40px 20px 20px !important;
            border-bottom: 1px solid #ccc;
            margin-bottom: 20px;
        }`
        if (sidebar == 'p_main_sidebar') {
            styleSt += `
            #block-1645527405198 {
                padding: 40px 20px !important;
                background: #ccc;
            }`
        } else{
            styleSt += `
            #section-p_secondary_sidebar .sizer{
                padding-top: 0px !important
            }`
        }
        $('.progress_styles').html(styleSt);
    
    }

    progressPercent(sidebar) {
        let st = ''
        
        var styleSt = `
        #section-p_secondary_sidebar .sizer{
            padding-top: 0px !important
        }
        #block-1647956355817 {
            padding: 22px 24px 0px 24px !important;
            margin-bottom: 20px;
        }`
        if (sidebar == 'p_main_sidebar') {
            styleSt += `
            #block-1647956355817 {
                padding: 20px 20px !important;
            }
            #section-p_secondary_sidebar .sizer{
                padding-top: 40px !important;
            }`
            st = "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\npadding: 20px !important;"
        } else{
            styleSt+=`
            #section-p_secondary_sidebar .sizer{
                padding-top: 0px !important
            }`
            st = "replace|/* -- Desktop Style --*/,/* -- Desktop Style --*/\npadding: 22px 24px 0px 24px !important;\n margin-bottom: 20px;"
        }
        $('.progress_styles').html(styleSt);
        JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_5.style|2"] = st 
    }

    progressColumnsAccent(sidebar) {
        let st = "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-block{\npadding: 20px !important;\nborder-radius: 5px;\nmargin-bottom: 20px;\nbackground: var(--accent-color-1);\ncolor:#fff;}"
        JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_4.style|1"] = st
    
        var styleSt = `
        #section-p_secondary_sidebar .sizer{
            padding-top: 20px !important
        }
        [block-id = 'user_progress_4'] {
            padding: 20px !important;
            border-radius: 5px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 20px;
            background: var(--accent-color-1);
            color: #fff;
        }
        [block-id = 'user_progress_4'] .text-wrap:before{
            background: #fff !important;
            opacity: 0.6 !important;
        }
        [block-id = 'user_progress_4'] .mini-dashboard-completion{
            opacity: 1 !important;
        }`
    
        if (sidebar == 'p_main_sidebar') {
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_4.style|2"] = "append|#this-block{margin: 0 20px 10px; border-bottom: 0}"
            styleSt += `
            [block-id = 'user_progress_4'] {
                
                margin: 0 20px 10px;
                border-bottom: 0 !important;
            }`
        }
        var sidebarIname = this.getSidebarIname(sidebar) 
    
        if (!sidebarIname.includes("discovery")){
            styleSt += `
            [block-id = 'user_progress_4'] {
                margin: 10px 10px;
                border-bottom: 0 !important;
            }
            #section-p_secondary_sidebar .sizer{
                padding-top: 0px !important
            }`
            JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "0"
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_4.style|3"] = "append|#this-block{margin: 10px 10px; border-bottom: 0}"
        }
        else{
            styleSt += `
            #section-p_secondary_sidebar .sizer{
                padding-top: 20px !important
            }
            `
            JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "20"
        }
    
        $('.progress_styles').html(styleSt);
    
    
    
    }
    
    progressColumnsLight(sidebar) {
        let st = "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-block{\npadding: 20px !important;\nborder-radius: 5px;\nmargin-bottom: 20px;\nbackground: rgb(0 0 0 / 10%);}\n.dark #this-block{\nbackground: rgb(255 255 255 /10%);}"
        JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_4.style|1"] = st 
        
        var styleSt = `
        [block-id = 'user_progress_4'] {
            padding: 20px !important;
            border-radius: 5px;
            margin-bottom: 20px;
            background: rgb(0 0 0 / 5%);
        }
        
        .dark [block-id = 'user_progress_4']{
            background: rgb(255 255 255 / 5%);
        }`
    
        if (sidebar == 'p_main_sidebar') {
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_4.style|2"] = "append|#this-block{margin: 0 20px 10px;}"
            styleSt += `
            [block-id = 'user_progress_4'] {
                
                margin: 0 20px 10px;
            }
            `
        }
        else{
            JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "20"
        }
    
        var sidebarIname = this.getSidebarIname(sidebar) 
    
        if (!sidebarIname.includes("discovery")){
            styleSt += `
            [block-id = 'user_progress_4'] {
                margin: 10px 10px;
            }`
            JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "0"
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_4.style|3"] = "append|#this-block{margin: 10px 10px;}"
        }
        else{
            styleSt += `
            #section-p_secondary_sidebar .sizer{
                padding-top: 20px !important
            }
            `
            JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "20"
        }
    
        $('.progress_styles').html(styleSt);
    
    }
    
    progressNoAvatarLight(sidebar) {
    
        let st = "replace|/* -- Custom Selectors --*/,/* -- Custom Selectors --*/\n#this-block{\npadding: 20px !important;\nborder-radius: 5px;\nmargin-bottom: 20px;\nbackground: rgb(0 0 0 / 10%);}\n.dark #this-block{\nbackground: rgb(255 255 255 /10%);}"
        JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_3.style|1"] = st 
        JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "22"
    
        var styleSt = `
        #section-p_secondary_sidebar .sizer{
            padding-top: 20px !important
        }
        [block-id = 'user_progress_3'] {
            padding: 20px !important;
            border-radius: 5px;
            margin-bottom: 20px;
            background: rgb(0 0 0 / 5%);
        }
        
        .dark [block-id = 'user_progress_3']{
            background: rgb(255 255 255 / 5%);
        }`
    
        if (sidebar == 'p_main_sidebar') {
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_3.style|2"] = "append|#this-block{margin: 0 20px 10px;}"
            styleSt += `
            [block-id = 'user_progress_3'] {
                
                margin: 0 20px 10px;
            }`
        }
        var sidebarIname = this.getSidebarIname(sidebar) 
    
        if (!sidebarIname.includes("discovery")){
            styleSt += `
            [block-id = 'user_progress_3'] {
                margin: 10px 10px;
            }
            #section-p_secondary_sidebar .sizer{
                padding-top: 0px !important
            }`
            JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "0"
            JTB_ProgressOverwrites.sections[sidebar]["blocks.user_progress_3.style|3"] = "append|#this-block{margin: 10px 10px;}"
        }
        else{
            styleSt += `
            #section-p_secondary_sidebar .sizer{
                padding-top: 20px !important
            }`
            JTB_ProgressOverwrites.sections[sidebar]["settings.padding_desktop.top"] = "20"
        }
        $('.progress_styles').html(styleSt);
    
    }
    
    getSidebarIname(sidebar){
       let iname = $('#section-'+sidebar).find('section').data('iname')
       if (iname != undefined){
        return iname
       } else {
        return ''
       }
      
    }
    
    
     
}


//console.log('bADGESSSS')
class Badges {
    constructor(){
        this.events()
        this.currentBadgeBlockIndex = -1
        this.currentBadgeBlockIndex_withClmns = -1
        this.badgeParentColumn = ""
        this.changeSidebar = false
        this.setMainOrSecInput()
    }
    
    events(){
        DEMO["badges"] = UCODE.badges2code["p_badges_6"]
        $(".badges_btns > div:nth-child(2)").addClass("active")
        $(".badges_btns > div").click(function(){
            $(".badges_btns > div").removeClass('active')
            $(this).addClass("active")
            BADGES.currentBadgeBlockIndex = -1
            BADGES.currentBadgeBlockIndex_withClmns = -1
            var sidebarPosition = $(this).data('value')
            if(sidebarPosition == 'p_main_sidebar'){
                sidebarPosition = 'm'
            } else{
                sidebarPosition = 's'
            }
            BADGES.changeSidebar = true
            DEMO.badge_position = sidebarPosition
            BADGES.changeBadge(UCODE.code2badges[DEMO.badges])            
            ROUTER.setUrl()
        })
        $(".badge-w").click(function(){
            var badge = $(this).attr("badge")
            DEMO.badges = UCODE.badges2code[badge]
            BADGES.changeBadge(badge)
            ROUTER.setUrl()
        })
    }
    loadBadges(){
        var badge_position = ROUTER.urlParm('bdp')
        if(badge_position){
            var fval = "p_secondary_sidebar"
            if(badge_position == "m") {
                fval = "p_main_sidebar"
            }
            $(".badges_btns > div").removeClass("active")
            $(".badges_btns > div[data-value='"+ fval +"']").addClass("active")
            DEMO.badge_position = badge_position
        }
        var badgeIndex = ROUTER.urlParm("bi")
        if(badgeIndex){
            DEMO.badgeIndex = badgeIndex
        }
        var badge = ROUTER.urlParm('bdg')
        if(badge){
            DEMO.badges = badge
            this.changeBadge(UCODE.code2badges[badge])
        }
    }
    setMainOrSecInput(){  
        var $badgeBlock = $('.n_p_main_sidebar .nblock-p_user,.n_p_main_sidebar .nblock-p_user, .n_p_secondary_sidebar .nblock-badges_placeholder,.n_p_secondary_sidebar .nblock-p_user')
        if ($badgeBlock.length != 0){
            var fval =  $badgeBlock.closest('section').attr('data-type')
            $(".badge_btns > div").removeClass("active")
        } else {
            if ($('.main_sidebar_wrap').hasClass('show-false')){
                var fval = 'p_secondary_sidebar'
            } 
        }
        $(".badges_btns > div[data-value='"+ fval +"']").addClass("active")
    }
    changeBadge(badge){
        // this.getCurrentBadgeBlockIndex()
        this.badgesRemove()
        var selectedSidebar = $(".badges_btns > .active").data("value");
        // if(DEMO.badge_position){
        //     selectedSidebar = DEMO.badge_position
        // }
        

        this.addBadgeBlock(selectedSidebar, badge)
        
    }
    getCurrentBadgeBlockIndex(){
        var clickedBagdePosition = "main"
        if(DEMO.badge_position == "s"){
            clickedBagdePosition = "secondary"
        }
        for (var sbar of ['main','secondary']){
            $('#section-p_'+sbar+'_sidebar .nblock').each(function (i){
                if ($(this).hasClass('nblock-badges_placeholder') && sbar == clickedBagdePosition){  
                    BADGES.currentBadgeBlockIndex = i
                    let clmnNumber = $(this).closest('.section-clmn').index()
                    BADGES.badgeParentColumn = $(this).closest('.section-clmn')
                    BADGES.currentBadgeBlockIndex_withClmns = i + clmnNumber + 1
                    return false
                }
            })
        }
    }
    badgesRemove(){
        $('#section-p_main_sidebar .nblock-badges_placeholder, #section-p_secondary_sidebar .nblock-badges_placeholder, .nblock-p_badges').remove()
        JTB_BadgeOverwrites = { 'sections': {} }
    }
    addBadgeBlock(sidebar,blockId){
        
        TOPBAR.changed('badges')
        //json
        DEMO.badge_position_name = sidebar
        var index = 1
        if (sidebar == 'p_main_sidebar'){
            if($('#section-p_main_sidebar > section').data("iname") == "main sidebar discovery 1"){
                index = 3
            }
            else{
                index = 0
            }
        }
        if (this.currentBadgeBlockIndex != -1){
            index = this.currentBadgeBlockIndex_withClmns
        }

        var jtbSection =  JTB_BadgeOverwrites.sections[sidebar]
        if (jtbSection == undefined){
            jtbSection = JTB_BadgeOverwrites.sections[sidebar] = {}
        }
        if(DEMO.badgeIndex){
            index = DEMO.badgeIndex
        }
        let rndNum =  Object.keys(jtbSection).length
        if(blockId != "no_badge"){
            if(JTB_overwrite.setStaticSections == undefined){
                JTB_overwrite.setStaticSections = {}
            }
            jtbSection["add_block|"+rndNum] = 'index:'+(index+1)+'|' + "badge_placeholder"
            JTB_overwrite.setStaticSections["p_badges"] = blockId
        }

        //html
        var blockHtml = $(MHTML.blocks[blockId])
        blockHtml.attr('block-id',blockId) 
        var numberOfblocks = $('#section-'+sidebar+' .section-clmn > .nblock').length
        if (numberOfblocks < index){
            index = numberOfblocks
        } 
        // var hasBadge = $('#section-'+sidebar+' .section-clmn > .nblock-badges_placeholder').length
        // if(hasBadge == 1){
        // $('#section-'+sidebar+' .section-clmn > .nblock-badges_placeholder').after(blockHtml)
        //     return false
        // }
        var index = 0
        if (sidebar == 'p_main_sidebar'){
            if($('#section-p_main_sidebar > section').data("iname") == "main sidebar discovery 1"){
                index = 2
            }
            else{
                index = 0
            }
        }
        if (this.currentBadgeBlockIndex != -1){
            index = this.currentBadgeBlockIndex
        }
        var removeBadgeFromOtherSidebar = "main"
        if(sidebar == "p_main_sidebar"){
            removeBadgeFromOtherSidebar = "secondary"
        }
        $(`#section-p_${removeBadgeFromOtherSidebar}_sidebar .nblock-badges_placeholder`).remove()

        if ($(this.badgeParentColumn).children().length == 0 && $(this.badgeParentColumn).parents("section").data("type") == sidebar && !this.changeSidebar){
            $(this.badgeParentColumn).append(blockHtml)
            return  false
        }
        if(DEMO.badgeIndex){
            index = DEMO.badgeIndex
        }
        $('#section-'+sidebar+' .section-clmn > .nblock').each(function (i){

            if(index == 0){
                $('#section-'+sidebar+' .section-clmn-1:not(.container-clmn)').prepend(blockHtml)
                return  false
            }
            if (i+1 == index){
                $(this).after(blockHtml)
            }
        })
    }
}

class Features {
    constructor(){
        this.events()
        this.getSectionsFromUrl()
        this.sortTabs()
        this.addClasstoTabs()
        this.syncKajabiTabs()
    }
    events(){
        $(".feature_posts > div").on("click", function(){
            FEATURES.changeSectionStyle($(this))
            ROUTER.setUrl()
        })
        $(".feature_tabs > div").click(function(){
            FEATURES.changeTabs($(this))
        })
        $("body").on("click", ".use-post-section > input", function(e){
            e.stopPropagation()
            if($(this).is(":checked")){
                $(this).closest(".post-section-sort").removeClass("post-disabled")
            } else {
                $(this).closest(".post-section-sort").addClass("post-disabled")
            }
            FEATURES.reorderPostSections()
            ROUTER.setUrl()
            FEATURES.changeSections()
            // FEATURES.getSectionsFromUrl()
            // var sections = POST.postPageSections()
            // LAYOUT.setContentSections(sections)
            // FEATURES.reorderPostSections()
        })
    }
    syncKajabiTabs(){
        var sections = []
        if(window.location.href.includes('kajabi.com')){
            $(`.features_tabs_sections .post-section-sort`).addClass("post-disabled")
            $(`.features_tabs_sections`).append($(`.features_tabs_sections .post-section-sort`).detach())
            $(`.features_tabs_sections .post-section-sort input`).prop("checked", false)
            $('.content section').each(function(){
                var sectionName = $(this).data('iname')
                    sectionName = sectionName.replace(/ /g, "_")
                    sections.push(sectionName)
                    $(`.features_tabs_sections`).append($(`.features_tabs_sections div[data-name="${sectionName}"]`).detach())
                    $(`.features_tabs_sections div[data-name="${sectionName}"] input`).prop("checked", true)
                    $(`.features_tabs_sections div[data-name="${sectionName}"]`).removeClass("post-disabled")
                
            })
            if($("section[data-iname='post media discovery v1'] section").hasClass("card_sections")){
                $(".feature_posts > div").removeClass("active")
                $(".feature_tabs > div[value='card']").addClass("active")
            } else{
                $(".feature_tabs > div[value='normal']").addClass("active")
            }
            if($(".tabs-wrapper").length){
                $(".post-tab:not(.mobile_only)").each(function(){
                    var tabSections = $(this).data("for")
                    var sectionName = $(`#section-${tabSections} section`).data('iname').replace(/ /g, "_")
                    $(`.post_tabs_sortable`).append($(`.features_tabs_sections div[data-name="${sectionName}"]`).detach())
                })
                if($("section[data-type='post_tabs']").hasClass("hidden--mobile")){
                    $(".feature_tabs > div").removeClass("active")
                    $(".feature_tabs > div[value='desktop_only']").addClass("active")
                }
            } else{
                $(".feature_tabs > div").removeClass("active")
                $(".feature_tabs > div[value='disable_tabs']").addClass("active")
                $(".post_tabs_wrapper").addClass("post-disabled").hide()
            }
            //console.log(sections)
        }
    }
    postSectionsSelected(tabs, sections){
        DEMO.postTabs = tabs
        DEMO.postSections = sections
        ROUTER.setUrl()
        this.getSectionsFromUrl()
        // var sections = POST.postPageSections()
        // LAYOUT.setContentSections(sections)
        // this.reorderPostSections()
        this.changeSections()
    }
    changeSections(){
        var barPosition = "r"
        var playList = "d"
        var sidebBarStyle = "r"
        if(DEMO.postSettings){
            playList = DEMO.postSettings.match(/PL./)[0].split('PL')[1]
            barPosition = DEMO.postSettings.match(/AP./)[0].split('AP')[1]
            sidebBarStyle = DEMO.postSettings.match(/RF./)[0].split('RF')[1]
        }
        POST.postActionBarPosition(UCODE.code2pBarPosition[barPosition])
        POST.postSidebarStyle(sidebBarStyle)
        POST.changePlaylist(UCODE.code2playlist[playList])
        TOPBAR.changed('change_post_layout')
    }
    getSectionsFromUrl(){
        var sbText = ROUTER.urlParm('pl')
        if(sbText){
            $(`.features_tabs_sections .post-section-sort`).addClass("post-disabled")
            $(`.features_tabs_sections`).append($(`.features_tabs_sections .post-section-sort`).detach())
            $(`.features_tabs_sections .post-section-sort input`).prop("checked", false)
            DEMO.postSections = sbText
            for (var item of sbText.split('-')){
                $(`.features_tabs_sections`).append($(`.features_tabs_sections div[data-name="${UCODE.code2psection[item]}"]`).detach())
                //console.log(UCODE.code2psection[item])
                $(`.features_tabs_sections div[data-name="${UCODE.code2psection[item]}"] input`).prop("checked", true)
                $(`.features_tabs_sections div[data-name="${UCODE.code2psection[item]}"]`).removeClass("post-disabled")
            }
        }
        var tabSections = ROUTER.urlParm('pt')
        if(tabSections){
            DEMO.postTabs = tabSections
            for(var item of tabSections.split("-")){
                if(item == "th"){
                    DEMO.showTabSection = false
                    $(".feature_tabs > div").removeClass('active')
                    $(".feature_tabs > div[value='disable_tabs']").addClass("active")
                    $(".post_tabs_wrapper").addClass("post-disabled").hide()
                } else if(item == "ds"){
                    DEMO.showTabSection = "desktop"
                    $(".feature_tabs > div").removeClass('active')
                    $(".feature_tabs > div[value='desktop_only']").addClass("active")
                } 
                else{
                    DEMO.showTabSection = true
                    $(".feature_tabs > div").removeClass('active')
                    $(".feature_tabs > div[value='enable_tabs']").addClass("active")
                    $(".post_tabs_wrapper").removeClass("post-disabled").show()
                }
                $(`.post_tabs_sortable`).append($(`.features_tabs_sections div[data-name="${UCODE.code2psection[item]}"]`).detach())
            }
        }
        var sectionStyle = ROUTER.urlParm('ts')
        if(sectionStyle){
            DEMO.postSectionStyle = sectionStyle
            $(".feature_posts > div").removeClass('active')
            if(sectionStyle == "c"){
                $(".feature_posts > div[value='card']").addClass('active')
            } else{
                $(".feature_posts > div[value='normal']").addClass('active')
            }
            this.changeSectionStyle($(".feature_posts > div.active"))
        } else{
            DEMO.postSectionStyle = 'n'
        }
    }
    sortTabs(){
        $(".post_tabs_sortable, .features_tabs_sections").sortable({
            axis: "x"
        })
        $(".post_tabs_sortable, .features_tabs_sections").sortable({
            connectWith: ".post_tabs_sortable, .features_tabs_sections",
            containment: ".post_tabs_sortable, .features_tabs_sections",
            update: function( event, ui ) {
                setTimeout(function(){
                    FEATURES.reorderPostSections()
                    ROUTER.setUrl()
                    POST.updatePostSettings()
                }, 1000)
                
            }
        }).disableSelection();
    }
    reorderPostSections(){
        var params = 'pm-'
        var length = $(".features_tabs_sections > div:not(.post-disabled)").length + $(".post_tabs_wrapper:not(.post-disabled) > div > div:not(.post-disabled)").length
        var index = 0
        var tabsParams = ""
        $(".features_tabs_sections > div:not(.post-disabled)").each(function(i){
            index++
            params += `${UCODE.psection2code[$(this).data("name")]}${length != index ? '-' : ''}`
            if($(this).data("name") == "post_tabs"){
                $(".post_tabs_sortable > div:not(.post-disabled)").each(function(d){
                    index++
                    tabsParams += `${UCODE.psection2code[$(this).data("name")]}${$(".post_tabs_wrapper:not(.post-disabled) > div > div:not(.post-disabled)").length - 1 != d ? "-" : ""}`
                    params += `${UCODE.psection2code[$(this).data("name")]}${(length != index )? '-' : ''}`
                })
                
            }
        })
        if(DEMO.showTabSection == false){
            tabsParams = 'th'
        } else if(DEMO.showTabSection == "desktop"){
            tabsParams += "-ds"
        }
        DEMO.postTabs = tabsParams
        DEMO.postSections = params
        this.setTabsSections()
        TOPBAR.changed('change_post_layout')
    }
    setTabsSections(){
        if(!DEMO.postTabs){return}
        var tabName = {
            "post_body_mobile_discovery_v1":{
                name: "Lesson Info",
                icon: "far fa-file"
            },
            "comments_discovery_v1":{
                name: "Comments",
                icon: "far fa-comment"
            },
            "post_user_notes":{
                name: "Notes",
                icon: "far fa-sticky-note"
            },
            "post_chat":{
                name: "Chat",
                icon: "far fa-comments-alt"
            },
            "post_questions":{
                name: "Questions",
                icon: "far fa-question-circle"
            },
            "post_related_posts":{
                name: "Related Lessons",
                icon: "far fa-chalkboard"
            }
        }
        $(".n_post_tabs .tabs-wrapper").html("")
        for(var tab of DEMO.postTabs.split("-")){
            if(tab == "th" || tab == "ts" || tab == "ds"){break}
            var st = `
                <div class="post-tab" data-for="${UCODE.code2psection[tab]}">
                    <span>
                        <i class="${tabName[UCODE.code2psection[tab]].icon}"></i>
                        ${tabName[UCODE.code2psection[tab]].name}
                    </span>
                </div>
            `
            $(".n_post_tabs .tabs-wrapper").append(st)
        }
        $(".n_post_tabs .tabs-wrapper > .post-tab:first-child").addClass("active")
        //console.log($("#user_notes_input"))
        this.toggleTabs()
        this.addClasstoTabs()
    }
    addClasstoTabs() {
        $(".post-tab:not(.mobile_only)").each(function() {
          var sectionId = $(this).data("for")
          $(`#section-${sectionId} section`).addClass("r2-tab-data")
        })
        if ($(window).width() < 768) {
          $(".mobile_only").each(function() {
            var sectionId = $(this).data("for")
            $(`#section-${sectionId} section`).addClass("r2-tab-data")
          })
        }
      }
    toggleTabs() {
        $(".post-tab:not(.mobile_only)").each(function() {
            var sectionId = $(this).data("for")
            if ($(this).hasClass("active")) {
              $(`#section-${sectionId} section`).removeClass("tab-data-hidden").addClass("active-tab-data")
            } else {
              $(`#section-${sectionId} section`).addClass("tab-data-hidden")
            }
          })
        if(tinyMCE != undefined){
            tinyMCE.remove('#user_notes_input');
            setTimeout(function() {
                tinymce.init({
                    selector: '#user_notes_input',
                    menubar: false,
                    plugins: [
                    'link',
                    'hr'
                    ],
                    toolbar: 'undo redo | blocks | bold italic | link | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | hr'
                })
            }, 3000);
        }
      }
    changeTabs($this){
        $(".feature_tabs > div").removeClass('active')
        $this.addClass("active")
        if($this.attr("value") == "disable_tabs"){
            $(".post_tabs_wrapper").after($(".post_tabs_wrapper > div > div"))
            $(".post_tabs_wrapper").addClass("post-disabled").hide()
            DEMO.showTabSection = false
        } else if($this.attr("value") == "desktop_only") {
            DEMO.showTabSection = "desktop"
        }
        else {
            $(".post_tabs_wrapper").removeClass("post-disabled").show()
            DEMO.showTabSection = true
        }

        this.reorderPostSections()
        ROUTER.setUrl()
        this.changeSections()
    }
    changeSectionStyle($this){
        var appendObj = {}
        $(".feature_posts > div").removeClass('active')
        $this.addClass("active")
        var style = `
            .post div[data-dynamic-sections] section:not([data-iname="post media discovery v1"], .post_sidebar, .n_post_tabs) {
                background: var(--bg-color-2);
                margin: 10px 15px;
            }
            .r2-tab-data {
                margin-top: 0 !important;
            }
            .r2-tab-data .sizer {
                padding: 40px 0 !important;
            }
            .r2-tab-data .row{
                padding: 0;
            }
            .tabs-wrapper {
                background: var(--bg-color-2);
            }
            .n_post_tabs .container, .n_post_tabs .sizer{
                padding: 0 !important;
            }
            .n_post_tabs{
                margin-top: 15px;
                margin-left: 15px;
                margin-right: 15px;
            }
        `
        var styleJson = `
        .post div|(data-dynamic-sections)| section:not(|(data-iname="post media discovery v1")|, .post_sidebar, .n_post_tabs) {
            background: var(--bg-color-2);
            margin: 10px 15px;
        }
        .r2-tab-data {
            margin-top: 0 !important;
        }
        .r2-tab-data .sizer {
            padding: 40px 0 !important;
        }
        .r2-tab-data .row{
            padding: 0;
        }
        .tabs-wrapper {
            background: var(--bg-color-2);
        }
        .n_post_tabs .container, .n_post_tabs .sizer{
            padding: 0 !important;
        }
        .n_post_tabs{
            margin-top: 15px;
            margin-left: 15px;
            margin-right: 15px;
        }
    `
        if($this.attr("value") == "card"){
            DEMO.postSectionStyle = "c"
            $('section[data-iname="post media discovery v1"]').append(`<style class="section_cards_style">${style}</style>`)
            appendObj = {
                "sections": { "post_media_discovery_v1": { 
                    "settings.section_style": `append|${styleJson}`} }
            }
        } else{
            $(".section_cards_style").remove()
            DEMO.postSectionStyle = "n"
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
        TOPBAR.changed('change_post_layout')
    }
}

//console.log("searchpage")
class Search {
    updateSearchSettings(){
        DEMO.searchSections = 'lsh-lf1'
        if(PAGE == "rsearch"){
            SIDEBARS.hideMainBarHtml()
            SIDEBARS.removeSecondBarHtml()
        }

    }
}

//console.log('p_header')

class Header{

    constructor(){
        this.events()
    }

    events(){
        $('.header-img img').click(function(){
            let name = $(this).attr('name')
            HEADER.changeHeader(name)
            ROUTER.setUrl()
        })
        $('.headers-wrap').click(function(){
            let name = $(this).attr('name')
            HEADER.changeHeader(name)
            ROUTER.setUrl()
            TOPBAR.changed('header')
        })
    }

    loadUrlHeader(){
        var header = ROUTER.urlParm('hd')
        if (header){
            var headerCode = header
        } else {
            var headerCode = 'd1'
        }
        DEMO.header = headerCode
        SIDEBAR_SETTINGS.dashboard.header = headerCode
        this.changeHeader(UCODE.code2headers[headerCode])

        var headerProgress = ROUTER.urlParm('hp')
        if (headerProgress){
            DEMO.headerProgress = headerProgress
            if (headerProgress == 'f'){
                $('.show_user_progress input[value="False"]').prop('checked','true') 
            }
            this.toggleUserProgress()
        }
    }

    setHeaderActiveTab(){
        $('.dashboard-tabs-tab').each(function (){
            if (PAGE == $(this).text().trim().toLowerCase()){
                $(this).addClass('dashboard-tabs-active')
            } else{
                $(this).removeClass('dashboard-tabs-active')
            }
        })
    }
    
    changeHeader(val){
        if(val == 'header_discovery_contained' || val == 'header_discovery_1'){
            val = 'header_discovery_1'
            
            let $newHeader = $(MHTML.sections[val])
            $newHeader.attr('not-dirty','true')
            $('#section-p_header').replaceWith($newHeader)
            $('#section-p_header .container').attr("style", "max-width: 1362px;")
            JTB_headerName = val
            JTB_headerOverwrites = {
                "settings.content_width": "1362px"
            }
            DEMO['header'] = UCODE.headers2code['header_discovery_contained']
        } else{
            let $newHeader = $(DYNAMIC_SECTIONS.replaceBeforeAddingSection(MHTML.sections[val]))
            $newHeader.attr('not-dirty','true')
            $('#section-p_header').replaceWith($newHeader)
            JTB_headerName = val
            JTB_headerOverwrites = {}
            DEMO['header'] = UCODE.headers2code[val]
        }
        DEMO.header_name = val
    }
    
    
    toggleUserProgress(){
        var headerName = $("#section-p_header .section").data('iname').replace(/ /g,"_");
        var userBlock = "blocks."+ headerName +"_user.progress_type"
        var appendObj = ''
        if($("input:radio[name ='show_user_progress']:checked").val() == "False"){
            $("#section-p_header .progress-bar").hide()
            appendObj = {
                "sections":{
                    "p_header":{
                        [userBlock]: "none"
                    }
                }
            }
            DEMO['headerProgress'] = 'f'
        }
        else{
            $("#section-p_header .progress-bar").show()
            appendObj = {
                "sections":{
                    "p_header":{
                        [userBlock]: "Bar"
                    }
                }
            }
            DEMO['headerProgress'] = 't'
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }

}



/*

PALLETES_light = [
    {name:"Lyon",colors:['#ef6db6','#0e86ca','#ffffff','#f7f7f9']},
    {name:"Tokyo",colors:['#f21a1a','#ffb434','#fefefe','#f4f6fb']},
    {name:"Palma",colors:['#5b1bb7','#f9a746','#ffffff','#e8e6ed']},
    {name:"Basel",colors:['#2980b9','#3498db','#ffffff','#fefefe']},
    {name:"Osaka",colors:['#ee4c7d','#e3afbc','#ffffff','#f8f8f8']},
    {name:"Melbourne",colors:['#fe2942','#cbc97e','#ffffff','#f7f7f9']},
    {name:"Madrid",colors:['#feb322','#fe489b','#ffffff','#f7f7f9']},
    {name:"Barcelona",colors:['#8e44ad','#e622c6','#ffffff','#ffffe6']},
    {name:"Paris",colors:['#1c38b0','#429be4','#ffffff','#fefefe']},
    {name:"london",colors:['#1c38b0','#429be4','#ffffff','#f7f7f9']},
    {name:"Hamburg",colors:['#ffdd00','#cbc97e','#ffffff','#ebebeb']},
    {name:"Berlin",colors:['#007fff','#6c6f85','#ffffff','#d9ecff']},
    {name:"Taipei",colors:['#95769b','#dd899a','#ffffff','#f7f7f7']},
    {name:"Geneva",colors:['#fdacb1','#fbbfc2','#ffffff','#fefefe']},
    {name:"Kyoto",colors:['#ffdd04','#2980b9','#ffffff','#f4f4f4']},
    {name:"Maui",colors:['#c6eaed','#1eb9dc','#ffffff','#edf9fa']},
    {name:"Stockholm",colors:['#688aff','#95a5a6','#fefefe','#f7f7f9']},
    {name:"oxford",colors:['#1e3bb1','#4edffe','#fefefe','#f7f7f9']},
    {name:"Sydney",colors:['#fe2942','#f0d0bd','#ffffff','#f8f8f8']},
    {name:"Rishikesh",colors:['#3498db','#95a5a6','#fefefe','#f4faec']},
    {name:"Rome",colors:['#f0d0bd','#808861','#ffffff','#f7f7f9']},
    {name:"Milan",colors:['#808861','#f0d0bd','#ffffff','#fbf1eb']},
    {name:"Venice",colors:['#b28258','#feceb7','#ffffff','#faebe5']},
    {name:"Oslo",colors:['#9924bc','#ab47c9','#ffffff','#f7f7f9']},
    {name:"Athens",colors:['#3a4dd8','#cdfe07','#ffffff','#f7f7f9']},
    {name:"Patras",colors:['#38358c','#ceff06','#ffffff','#fcffed']},
    {name:"Varanasi",colors:['#1d8ba4','#429be4','#ffffff','#f7f7f9']},
    {name:"Vienna",colors:['#1c38b0','#429be4','#ffffff','#f7f7f9']},
    {name:"Graz",colors:['#e67e22','#6c6f85','#fefefe','#f7f7f9']},
    {name:"Lisbon",colors:['#9d5869','#bbbfbf','#ffffff','#ecf0f1']},
    {name:"Porto",colors:['#3498db','#e74c3c','#ffffff','#f5f1ed']},
    {name:"Piraeus",colors:['#c7c341','#f0fb81','#ffffff','#f7f7f9']},
    {name:"Amsterdam",colors:['#e0d92e','#f0fb81','#ffffff','#f7f7f9']},
    {name:"Prague",colors:['#1eb9dc','#2c3e50','#ffffff','#ecf0f1']},
    {name:"Monaco",colors:['#feb7c2','#6c6f85','#fff5f4','#d1e5e8']},
    {name:"Santiago",colors:['#f9a746','#ffca51','#ffffff','#f7f7f9']}    
]




*/


PALLETES_light = [


  
 
    {name:'Lyon',colors:['#005ffe','#fadc4a','#F4F5FC','#FFFFFF']},
    {name:'Lyon',colors:['#07314C','#FFE0E0','#ffffff','#fefefe']},
    {name:'Lyon',colors:['#808861','#DBF184','#F4F5FC','#FFFFFF']},
    {name:'Lyon',colors:['#3F3845','#89A6FF','#F4F5FC','#FFFFFF']},

    {name:'Lyon',colors:['#474954','#7284A8','#FFFFFF','#F4F4F4']},
    {name:'Lyon',colors:['#1F4958','#CADCFF','#ffffff','#ecf0f1']},

    {name:'Lyon',colors:['#1858','#F582AE','#F2E9D7','#FEF6E4']},
    {name:'Lyon',colors:['#395F8B','#FFFFFF','#E8E8E9','#ecf0f1']},
    {name:'Lyon',colors:['#808861','#7C7CA1','#FFFFFF','#FBF1EB']},



    {name:'Lyon',colors:['#94769A','#D78597','#F4F5FC','#FFFFFF']},

    {name:'Lyon',colors:['#39898B','#FFFFFF','#E3F1E8','#ecf0f1']},


 

    {name:'Lyon',colors:['#f21a1a','#A4CBFF','#fefefe','#f4f6fb']},
    {name:'Lyon',colors:['#0D3078','#CADCFF','#ffffff','#ecf0f1']},

    {name:'Lyon',colors:['#3F3845','#89A6FF','#F4F5FC','#FFFFFF']},
    {name:'Lyon',colors:['#8B3960','#FFFFFF','#F1E3EB','#F4E9F3']},
    {name:'Lyon',colors:['#2980b9','#3498db','#ffffff','#fefefe']},
  
    {name:'Lyon',colors:['#397D8B','#FFFFFF','#E3EDF1','#E9F4F4']},
    {name:'Lyon',colors:['#ef6db6','#8FD7FF','#ffffff','#f7f7f9']},
    {name:'Lyon',colors:['#874F6F','#8FD7FF','#F4F5FC','#FFFFFF']},

    {name:'Lyon',colors:['#398789','#8ED3D5','#F4F5FC','#FFFFFF']},
    {name:'Lyon',colors:['#8B3939','#FFFFFF','#F1E3E3','#F4E9ED']},

    {name:'Lyon',colors:['#4D3355','#DA2343','#FFFFFF','#FFFFFF']},
    {name:'Lyon',colors:['#DB588F','#E5CBD3','#ffffff','#FFFFFF']},




    {name:'Lyon',colors:['#5669FF','#FF7272','#FFFFFF','#FFFFFF']},

    {name:'Lyon',colors:['#395F8B','#0A58B3','#F4F5FC','#FFFFFF']},

    {name:'Lyon',colors:['#18071D','#DA2343','#FFFFFF','#FFFFFF']}


    



    
]


PALLETES_dark = [
    {name:'Lyon',colors:['#FF8ACD','#A65281','#141313','#1F1F1F']},  
    {name:'Lyon',colors:['#F8A746','#262D33','#03101D','#051626']},
    {name:'Lyon',colors:['#808861','#634C6C','#242937','#1A1E28']},
    {name:'Lyon',colors:['#005ffe','#392BB9','#141313','#1F1F1F']},
    {name:'Lyon',colors:['#982C86','#EB40FE','#000000','#982C86']},

    {name:'Lyon',colors:['#005ffe','#526B99','#141313','#0C0C0C']},

    {name:'Lyon',colors:['#005ffe','#3E78E1','#526B99','#141831']},


    
    {name:'Lyon',colors:['#EE4C7D','#EE4C7D','#141313','#1F1F1F']},






    {name:'Lyon',colors:['#929292','#03101D','#141313','#1F1F1F']},
    {name:'Lyon',colors:['#007fff','#865252','#141313','#1F1F1F']},
    {name:'Lyon',colors:['#FF8906','#AFAFAF','#141313','#1F1F1F']},

    {name:'Lyon',colors:['#003181','#8286D2','#1B1528','#1F1F1F']},
    {name:'Lyon',colors:['#fe2942','#0B0707','#141313','#1F1F1F']},


    {name:'Lyon',colors:['#FFB516','#9B6E0D','#1A2023','#252C2E']},


    
    



    {name:'Lyon',colors:['#C34889','#FE4042','#403E3C','#1F1F1F']},
    {name:'Lyon',colors:['#00ADFF','#F47656','#141313','#1F1F1F']},
    {name:'Lyon',colors:['#4F8573','#DA2343','#141313','#1F1F1F']},
    {name:'Lyon',colors:['#687FFF','#7284A8','#141313','#1F1F1F']},
    {name:'Lyon',colors:['#003181','#1D0009','#141313','#1F1F1F']},
    {name:'Lyon',colors:['#2980b9','#3498db','#143041','#216188']},

    {name:'Lyon',colors:['#DB9942','#FE4042','#000000','#DB9942']},
    {name:'Lyon',colors:['#003181','#1D0009','#1B1528','#1F1F1F']}

]


//console.log('p_sidebar')

class Outline{

    constructor(){
        this.events()
    }

    events(){
        $('.sOutline_item').click(function () {
          OUTLINE.outline_item_clicked($(this))
        })
    }

    outline_item_clicked($this) {
        JTB_outlineOverwrites = {}
        let outline = $this.data('outline')
        $('.sOutline_item').removeClass('active')
        $this.addClass('active')
        LAYOUT.changeOutline(outline)
        if(outline == "none"){
          outline = 'outline_discovery_2'
          $(".outline-post-progress").hide()
        }
        
        $('.select_outline').val(outline)
        $('.p_theme_set_wrap').html($this[0].outerHTML)
        $('.p_theme_set_wrap .sOutline_item').removeClass('active')
        DEMO['outline'] = outline
        if(IsR2){
          var newOutline = 'OT' + UCODE.outline2code[outline]
          DEMO['sidebars'] = DEMO.sidebars.replace(/OT../g, newOutline)
        }

        ROUTER.setUrl()
        TOPBAR.changed('outline')

      
    }

}






PRODUCT_URL = '/products/'
LOAD_COMPLETED = false
URL_PARMS = ''
KEYS_name2code= {p:'page',fnc:'fnc',colors:'clr',colorMode:'cm',sidebars:'sb',sections:'ds',header:'hd',headerProgress:'hp',contentTopPadding:'tp',contentWidth:'cw',postTopPadding:'pp',dev:'dev',
background:'bg',postSettings:'ps',postTabs:'pt',postSections: 'pl', postSectionStyle: 'ts',categoriesSections:'cl',categorySections:'cs',searchSections: 'sh',buttons:'b',miniFunctions:'mf',outline_collapse:'oc',mainBar: 'mnb', secondBar: 'snb', badges: 'bdg', badge_position: 'bdp', badgeIndex: "bi"}

KEYS_code2name = {page:'p',fnc:'fnc',clr:'colors',cm:'colorMode',sb:'sidebars',ds:'sections',hd:'header',hp:'headerProgress',tp:'contentTopPadding',cw: 'contentWidth',pp:'postTopPadding',dev:'dev',
bg:'background',ps:'postSettings',pl:'postSections',pt:'postTabs',ts:'postSectionStyle',cl:'categoriesSections',sh:'searchSections',cs:'categorySections',b:'buttons',mf:'miniFunctions',oc:'outline_collapse',mnb: 'mainBar',snb: 'secondBar', bdg: 'badges', bdp: 'badge_position', bi: "badgeIndex"}
//console.log(window.location.href)
PAGE = ''
DEMO = {}

//console.log('p_url')

class Router{

    constructor(){
        this.preventLinkDefaults()
    }

    
    urlParm(key){
        if(IsR2){
            const queryString = window.location.search;
            URL_PARMS = new URLSearchParams(queryString);
            DEMO[KEYS_code2name[key]] = URL_PARMS.get(key)
            return URL_PARMS.get(key)
        }
        var val = KEYS_code2name[key]
        if (val == undefined){
            val = KEYS_name2code[key]
        }
        return DEMO[val]
    }
    
    getSubParm(parm,subParm){
        if (this.urlParm(parm)){
        var parm_st = this.urlParm(parm)
        } else {
            var parm_st = ''
            if (parm == 'sidebars'){
            parm_st = 'MSt-MPl-SSt-SFr-SPr-OTd1-OSf-PBh-PSs'
            }
        }
        subParms_r = parm_st.split('-')
        
        for (var this_subParm of subParms_r){
            if (this_subParm.includes(subParm)){
                return this_subParm.replace(subParm,'')
            }
        }
    }

    url2demo(url){
        DEMO = {}
        for (var key of Object.keys(KEYS_code2name)){
            DEMO[key]= ''
        }
        var url_r = url.split('?')
        if (url_r.length == 0){
            var parms = url.split('?')[0]
        } else {
            var parms = url.split('?')[1]
        }
        for (var parm of parms.split('&')){
            var pKey = parm.split('=')[0]
            var pVal = parm.split('=')[1]
            DEMO[KEYS_code2name[pKey]]= pVal
        }
    } 

    loadUrl(){        
        DEMO['page'] = PAGE
        //console.log("pagess", PAGE)
        LAYOUT.resetJTB()
        LAYOUT.setLayoutAndPlaylistToDefault()
        LAYOUT.dashboardDefaultLayout()
        COLORS.loadUrlColors()
        COLORS.loadUrlColorMode()
        SIDEBARS.loadUrlTopPaddingDashboard()
        SIDEBARS.updateSidebars()
        HEADER.loadUrlHeader()
        BADGES.loadBadges()
        POST.updatePostSettings()
        SEARCH.updateSearchSettings()
        this.loadUrlSections()
        this.loadUrlCategories()
        this.loadUrlBg()
        MINI_FUNCS.loadUrlMiniFunctions()
        HEADER.setHeaderActiveTab()
        this.toggleCuriosityClass()
        //DEMOS.showDemosOnLoad()
        this.setPageSelect()

        $('select').niceSelect()
        $('.page_wrap').scrollTop(0)
        //console.log(JTB_overwrite)
        LOAD_COMPLETED = true
    }
    setPageSelect(){
        if (PAGE == 'post'){$('.page_select').val('Post')}
        else if (PAGE == 'categories'){$('.page_select').val('Categories')}
        else if (PAGE == 'category'){$('.page_select').val('Single Category')}
        else if (PAGE == 'announcments'){
            $('.page_select').val('Annoucments')
        }
        else if (PAGE == 'rsearch'){
            $('.page_select').val('RSearch')
        }
    }
    toggleCuriosityClass(){
        var dev = this.urlParm('dev')
        //console.log('toggle cctss')
        if (dev){
            //console.log('toggle cct')
            DEMO.dev = dev
            LAYOUT.setThemeTypeClass('curiosity')
            var appendObj =
            {
                "theme_settings":
                {
                    "theme_type": "curiosity",
                }
            }
            LAYOUT.JTB_append(appendObj,JTB_overwrite)
        } else {
            LAYOUT.setThemeTypeClass('not_curiosity')
        }
        ROUTER.setUrl()
    }



    loadUrlSections(){
        DEMO.sections = this.loadUrlGetSectionsCodes('ds','vb1-lwid1-cl1-da2')
        DEMO.categoriesSections = this.loadUrlGetSectionsCodes('cl','clh-cl5')
        DEMO.categorySections = this.loadUrlGetSectionsCodes('cs','csh-cs1')
        DEMO.announcmentsSections = this.loadUrlGetSectionsCodes('an','da2-a3')
        DEMO.searchSections = this.loadUrlGetSectionsCodes('sh','lsh-lf1')
        //console.log("page", PAGE)
        if (PAGE == HOMEPAGE){ var sectionsCodes = DEMO.sections }
        if (PAGE == 'categories'){ var sectionsCodes = DEMO.categoriesSections }
        if (PAGE == 'category'){ var sectionsCodes = DEMO.categorySections }
        if (PAGE == 'announcments'){ var sectionsCodes = DEMO.announcmentsSections}
        if (PAGE == 'rsearch'){ var sectionsCodes = DEMO.searchSections}
        if (PAGE == 'post'){ return }

        $('.dynamic_sections_wrap_inner').html('')
        $('div[data-content-for-index]').html('')
        for (var section of sectionsCodes.split('-')){
            DYNAMIC_SECTIONS.addDynamicSectionHelper(UCODE.code2sections[section])
        }
        $('.jarallax').jarallax({speed: 0.2});
    }

    loadUrlGetSectionsCodes(paramName,defaults){
        var sectionsSt = this.urlParm(paramName)
        if (sectionsSt){
            return sectionsSt
        } else {
            return defaults
        }
    }


    loadUrlBg(){
        var bg_st = this.urlParm('bg')
        if (bg_st){
            DEMO.background = bg_st
            this.changeBackgroud(UCODE.code2background[bg_st], true)
            $('.select_background').val(UCODE.code2background[bg_st])
        } else{
            var st = `
            .p_wrap_out{
                background: none !important;
            }
            `
            $('.dynamic_styles').append(st);
        }
    }
    


    setUrl(onlyReturnVal = false){
        if(!IsR2){
            return;
        }
        
        var r = [];
        for (var key of Object.keys(KEYS_name2code)){
            if (DEMO[key] != '' && DEMO[key] && key != 'p'){
                r.push(KEYS_name2code[key] +'='+ DEMO[key])
                
            }
        }
        let base = '/products/?';

        let dPage = PAGE.substring(0,1).toLowerCase()
        if(dPage == 'i'){
            dPage = 'd'
        }
        DEMO['page'] = dPage
        var new_url = base + 'p='+dPage+'&' + r.join('&')
        if (!onlyReturnVal){
            history.pushState('', '', new_url   )
        }
        return new_url
        
    }


    preventLinkDefaults(){
        $('body').on('click','.outline-post-wrap, .playlist__body a,.nblock-p_resume_button a,.post_next_wrap a,.p_lessons_wrap a',function (e) {
            e.preventDefault()
            PAGE = 'post'
            let redirectUrl = ROUTER.setUrl(true)
            window.location.href = redirectUrl
        })
        $('body').on('click','.dashboard-tabs a',function (e) {
            e.preventDefault()
            PAGE = $(this).text().trim() 
            let redirectUrl = ROUTER.setUrl(true)
            window.location.href = redirectUrl
        })
        $('body').on('click','.n_p_categories a',function (e) {
            e.preventDefault()
            PAGE = 'single category' 
            let redirectUrl = ROUTER.setUrl(true)
            window.location.href = redirectUrl
        })
        
        let st = '.nblock[id*="block-main_sidebar_discovery_v1_container"] a,' 
        st += '.nblock[id*="block-1634639269849"] a' 

        $('body').on('click','.comments-btn,.reply-to-comment,'+st,function (e) {
            e.preventDefault()
        })

    }


    changeBackgroud(val, isDemo){
        BACKGROUND[val](isDemo);
        DEMO['background'] = UCODE.background2code[val]
        this.setUrl()
    }



    loadUrlCategories(){
        var categoriesSt = ROUTER.urlParm('cl')
        if (categoriesSt){
            var catStyle = categoriesSt.split('-')[1]
        } else {
            var catStyle = 'cl5'
        }
        $('.select_categories_list').val(UCODE.code2sections[catStyle])
    
        categoriesSt = ROUTER.urlParm('cs')
        if (categoriesSt){
            catStyle = categoriesSt.split('-')[1]
        } else {
            catStyle = 'cs1'
        }
        $('.select_category_list').val(UCODE.code2sections[catStyle])
    }

}



//console.log('sidebars')

class Sidebars {

    updateSidebars() {
        var width = ROUTER.urlParm('cw')
        if(width){DEMO.contentWidth = width }

        //console.log('update sidebars')
        var sbText = ROUTER.urlParm('sb')
        //console.log(sbText)
        var sbSttr, sbVal = ''
        var mBarPoisiton = SIDEBAR_SETTINGS.dashboard.mainSidebarPosition
        var showMBar = SIDEBAR_SETTINGS.dashboard.showMainSidebar
        var showSBar = SIDEBAR_SETTINGS.dashboard.showSecondarySidebar
        if (sbText) {
            DEMO.sidebars = sbText
            for (var item of sbText.split('-')) {
                sbSttr = item.substring(0, 2)
                sbVal = item.substring(2)

                if (sbSttr == 'MS') {
                    this.toggleMainSidebar(sbVal, mBarPoisiton)
                    // this.toggleMainSidebarPosition(mBarPoisiton, sbVal)
                    showMBar = sbVal
                }
                else if (sbSttr == 'MP') {
                    mBarPoisiton = sbVal
                    this.toggleMainSidebarPosition(sbVal, showMBar)
                }
                else if (sbSttr == 'SS') {
                        this.toggleSbar(sbVal)
                        showSBar = sbVal
                }
                else if (sbSttr == 'SF') {
                    this.sBarStyle(sbVal)
                }
                else if (sbSttr == 'SP') {
                    this.sBarPosition(sbVal)
                }
                else if (sbSttr == 'OT') {
                    $(".select_outline").val(UCODE.code2outline[sbVal]);
                    let $outlineItem = $('.sOutline_item[data-outline="' + UCODE.code2outline[sbVal] + '"]')
                    $outlineItem.addClass('active')
                    $('.p_theme_set_wrap').html($outlineItem[0].outerHTML)
                    $('.p_theme_set_wrap .sOutline_item').removeClass('active')
                    LAYOUT.changeOutline(UCODE.code2outline[sbVal])
                }

                else if (sbSttr == 'PB') {
                    // $(".select_progress").val(UCODE.code2progress[sbVal]);
                    PROGRESS.changeProgress(UCODE.code2progress[sbVal])
                    DEMO.progress = UCODE.code2progress[sbVal]
                }
                else if (sbSttr == 'PS') {
                    var fval = 'p_main_sidebar'
                    if (sbVal == 's') { var fval = 'p_secondary_sidebar' }
                    $(".progress_main_or_sec_wrap input[value='" + fval + "']").prop("checked", true);
                    $(".progress_btns > div").removeClass("active")
                    $(".progress_btns > div[data-value='" + fval + "']").addClass("active")
                    PROGRESS.changeProgress(DEMO.progress)
                }

            }
        } else {
            this.setSidebarsOptionsDefaults()
        }

        this.sideBarValue(showMBar, showSBar)
        this.changeMainBar()
        this.changeSecondBar()
        this.setContentWidth()
    }

    changeMainBar(){
        var mainBar = ROUTER.urlParm('mnb')
        if(mainBar){
            DEMO['mainBar'] = mainBar
            LAYOUT.setMainBar(UCODE.code2sidebars[mainBar])
        }
    }
    changeSecondBar(){
        var secondBar = ROUTER.urlParm('snb')
        if(secondBar){
            DEMO['secondBar'] = secondBar
            this.setSecondBar(UCODE.code2sidebars[secondBar])
        }
    }
    // changeBadge(){
    //     var badge = ROUTER.urlParm('bdg')
    //     if(badge){
    //         DEMO.badges = badge
    //         JTB_overwrite.setStaticSections["p_badges"] = UCODE.code2badges[badge]
    //     }
    // }
    layoutSelected($this){
        if ( $this.attr('demo') == 'post_page'){
            PAGE = 'post'
            let redirect_url = ROUTER.setUrl(true)
            window.location.href =  redirect_url
            return
        }

        $('.apply_button').removeClass('disab')
        DEMO.sidebars = $this.attr('demo')
        DEMO.contentTopPadding = $this.attr('tp')
        DEMO.contentWidth = $this.attr('cw')
        this.changeContentPadding(parseInt($this.attr('tp')))
        ROUTER.setUrl()
        this.updateSidebars()
        TOPBAR.changed('change_layout')
    }

    loadUrlTopPaddingDashboard(){
        var contentTopPadding = ROUTER.urlParm('tp')
        if (!contentTopPadding){
            contentTopPadding = 0
        } 
        DEMO.contentTopPadding = contentTopPadding
        this.changeContentPadding(contentTopPadding)
    }


    toggleMainSidebar(val, position) {
        if ($('.toggle-sidebar').length == 0) {
            var btn = `
            <button class="toggle-sidebar"><i class="far fa-exchange"></i></button>
            `
            $('.p_wrap_out').prepend(btn)
        }
        if (val == 'f') {
            this.hideMainBar()
            LAYOUT.setThemeTypeClass('curiosity')
        }
        else {
            LAYOUT.setThemeTypeClass('not_curiosity')
            $('.main_sidebar_wrap').show()
            $('.main_sidebar_wrap').removeClass('show-false')
            $('.main_sidebar_wrap').addClass('show-true')

            $('.toggle-sidebar').show()
            $('.p_wrap_out').addClass('show_main_sidebar')
            $('.main-content-spacer, #section-p_header .sizer ').css('max-width', '100%')
            if (position == "r") {
                $('.p_wrap_out').addClass('main_sidebar_position-Right')
            }
            else {
                $('.p_wrap_out').addClass('main_sidebar_position-Left')
            }
            if (JTB_overwrite['sections'] == undefined) {
                JTB_overwrite['sections'] = {}
            }
            JTB_overwrite.sections["p_main_sidebar"] = {
                "settings.show_sidebar_dashboard": "true"
            }

            if (JTB_overwrite['theme_settings'] == undefined) {
                JTB_overwrite['theme_settings'] = {}
            }
            JTB_overwrite.theme_settings["content_width"] = "100%"
        }
        SIDEBAR_SETTINGS.dashboard.showMainSidebar = val
        DEMO.show_main_bar = val
    }

    toggleMainSidebarPosition(position, show) {
        if (show != "f") {
            if (position == "r") {
                $('.toggle-sidebar').attr('style', 'left: auto !important;')
                $('.p_wrap_out').removeClass('main_sidebar_position-Left').addClass('main_sidebar_position-Right')
                let appendObj1 = {
                    "sections": { "p_main_sidebar": { "settings.position": "Right" } }
                }
                LAYOUT.JTB_append(appendObj1, JTB_overwrite)
            }
            else if(position == "l"){
                $('.toggle-sidebar').removeAttr('style')
                $('.p_wrap_out').removeClass('main_sidebar_position-Right').addClass('main_sidebar_position-Left')
                let appendObj1 = {
                    "sections": { "p_main_sidebar": { "settings.position": "Left" } }
                }
                LAYOUT.JTB_append(appendObj1, JTB_overwrite)
            }
        }
        
        SIDEBAR_SETTINGS.dashboard.mainSidebarPosition = position
    }

    hideMainBar() {
        //html
        this.hideMainBarHtml()

        //json
        if (JTB_overwrite['sections'] == undefined) {
            JTB_overwrite['sections'] = {}
        }
        JTB_overwrite.sections["p_main_sidebar"] = {
            "settings.show_sidebar_dashboard": "false"
        }
        if (JTB_overwrite['theme_settings'] == undefined) {
            JTB_overwrite['theme_settings'] = {}
        }
        JTB_overwrite.theme_settings["content_width"] = "1352px"
    }

    hideMainBarHtml() {
        //html
        $('.main_sidebar_wrap').hide()
        $('.main_sidebar_wrap').addClass('show-false')
        $('.main_sidebar_wrap').removeClass('show-true')
        $('.main-content-spacer, #section-p_header .sizer ').css('max-width', DEMO.contentWidth+'px').css('margin', '0 auto')
        $('.toggle-sidebar').hide()
        $('.p_wrap_out').removeClass('show_main_sidebar').removeClass('main_sidebar_position-Left').removeClass('main_sidebar_position-Right')

    }

    // Secondary Sidebar
    toggleSbar(val) {
        if (val == "f") {
            this.removeSecondBarHtml()
            JTB_overwrite.sections["p_secondary_sidebar"] = {
                ...JTB_overwrite.sections.p_secondary_sidebar,
                "settings.show_sidebar_dashboard": "false"
            }
        }
        else {
            this.showSecondarySidebar_html()
            JTB_overwrite.sections["p_secondary_sidebar"] = {
                ...JTB_overwrite.sections.p_secondary_sidebar,
                "settings.show_sidebar_dashboard": "true"
            }
        }
        SIDEBAR_SETTINGS.dashboard.showSecondarySidebar = val
        DEMO.show_second_bar = val
    }

    showSecondarySidebar_html() {
        $('.main-content-inner .sidebar').css('display', 'flex')
        $('.content').addClass('col-md-8').removeClass('col-md-12')
    }

    removeSecondBarHtml() {
        $('.main-content-inner .sidebar').hide()
        $('.content').removeClass('col-md-8').addClass('col-md-12')
    }

    sBarStyle(val) {
        if (val == "r") {
            this.setSecondBar('secondary_sidebar_discovery_1')
        } else {
            this.setSecondBar('secondary_sidebar_evolution_1')
            LAYOUT.changeOutline('outline_evolution_2')
            $('.select_outline').val('outline_evolution_2')
        }
        SIDEBAR_SETTINGS.dashboard.secondarySidebarStyle = val
    }

    setSecondBar(section_name) {
        var text = DYNAMIC_SECTIONS.replaceBeforeAddingSection(MHTML.sections[section_name])
        var $newSection = $(text)
        $newSection.attr('not-dirty', 'true')
        $('#section-p_secondary_sidebar').replaceWith($newSection)

        JTB_overwrite.setStaticSections = {
            ...JTB_overwrite.setStaticSections,
            "p_secondary_sidebar": section_name
        }
    }


    sBarPosition(val) {
        var appendObj = {}
        if (val == "r") {
            $('.main-content .sidebar').css('order', '2').addClass('ssbar-right').removeClass('ssbar-left')
            $('.main-content .content').removeClass('content-right')
            appendObj = {
                "sections": { "p_secondary_sidebar": { "settings.position": "Right" } }
            }
        }
        else {
            $('.main-content .sidebar').css('order', '0').addClass('ssbar-left').removeClass('ssbar-right')
            $('.main-content .content').addClass('content-right')
            appendObj = {
                "sections": { "p_secondary_sidebar": { "settings.position": "Left" } }
            }
        }
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
        SIDEBAR_SETTINGS.dashboard.secondarySidebarPosition = val
    }

    sideBarValue(showMain, showSec) {
        var main = false
        var secondary = false
        var val = 'Show None'
        if (showMain == "t") {
            main = true
            val = 'Show Main'
        }
        if (showSec == "t") {
            secondary = true
            val = 'Show Secondary'
        }
        if (main && secondary) {
            val = 'Show Both'
        }
        $('.te_show_sidebars_block span').html(val)
    }

    setSidebarsOptionsDefaults() {
        $('.select_outline').val('outline_discovery_1')
        var $outlineItem = $('.sidebar_block .sOutline_item[data-outline="outline_discovery_1"]')
        $outlineItem.addClass('active')
        JTB_outlineName = 'outline_discovery_1'
        this.toggleMainSidebar('t', 'l')
        this.toggleMainSidebarPosition('l', 't')
        if (PAGE != 'post') {
            this.toggleSbar('t')
        }
        this.sBarStyle('r')
        this.sBarPosition('r')
        $(".select_progress").val('Hide');
        PROGRESS.changeProgress('Hide')
        DEMO.sidebars = 'MSt-MPl-SSt-SFr-SPr-OTd1-OSf-PBh-PSs'
    }
    setContentWidth(){
        var width = ROUTER.urlParm('cw')
        var unit = 'px'
        if(width){
            if (width.includes('%')){
                unit = ''
            }
            TOPBAR.changed('change_layout')
            var st = `
            .container, .main-content-spacer{
                max-width: ${width}${unit} !important;
                margin: 0 auto;
            }
            `
            $('.dynamic_styles').append(st)
            var appendObj = {
                "theme_settings": {
                    "content_width": `${width}${unit}`,
    
                }
            }
            DEMO.contentWidth = width
            LAYOUT.JTB_append(appendObj, JTB_overwrite)
        } else{
            var st = `
            .container{
                max-width: inherit !important
            }
            `
            $('.dynamic_styles').append(st)
        }
    }
    changeContentPadding(val) {
        TOPBAR.changed('change_layout')

        if (PAGE != 'post'){
            var st = `
            .main-content-spacer{
                padding-top: ${val}px !important
            }
            @media(max-width: 768px){
                .main-content-spacer{
                    padding-top: 20px !important
                }
            }
            `
            $('.dynamic_styles').append(st)
        }

        DEMO['contentTopPadding'] = val
        var appendObj = {
            "theme_settings": {
                "content_top_padding": `${val}px`,

            }
        }

        $('.top_padding_dashboard input').val(val)
        LAYOUT.JTB_append(appendObj, JTB_overwrite)
    }
}




(function(){

    UCODE = {}
    
    
    
    
    
    function append_ucode(list,toCode,codeTo){
        UCODE[toCode] = {}
        UCODE[codeTo] = {}
        var r = []
        for (row of list.split('\n')){
            r = row.split(',')
            if (r.length < 2){continue}
            UCODE[toCode][r[0].trim()] = r[1].trim()
            UCODE[codeTo][r[1].trim()] = r[0].trim()
        }  
    }
    
    
    var outlines = `
    Hide,h
    outline_discovery_1,d1
    outline_discovery_2,d2
    outline_discovery_3,d3
    outline_discovery_4,d4
    outline_discovery_4_icon_minimal,mi
    outline_discovery_4_icon_doodle,do
    outline_discovery_4_icon_boxed_radius,br
    outline_discovery_4_icon_boxed,ib
    outline_discovery_5,d5
    outline_discovery_6,d6
    outline_discovery_7,d7
    outline_curiosity_1,c1
    outline_curiosity_2,c2
    outline_evolution_1,e1
    outline_evolution_2,e2
    `
    append_ucode(outlines,'outline2code','code2outline')
    
    
    var progress_blocks = `
    Hide,h
    Avatar Basic,ab
    No Avatar,na
    No Avatar Light,nal
    All Elements,ae
    Columns,c
    Columns Accent,ca
    Columns Light,cl
    Columns Percent,cp
    `
    append_ucode(progress_blocks,'progress2code','code2progress')
    
    
    
    var headers = `
    header_discovery_1,d1
    header_discovery_1,hc
    header_discovery_with_links,dl
    header_curiosity_1,c1
    header_curiosity_2,c2
    header_curiosity_2_with_links,cl
    header_curiosity_3,c3
    header_evolution,e
    header_accent_background,ab
    `
    append_ucode(headers,'headers2code','code2headers')
    
    
    
    var ev_backgrounds = `
    ev_fitness,fit
    evBusiness,bus
    evBusiness2,bus2
    evEducation,edc
    evCooking,ckg
    evGolf,glf
    evPhoto,pht
    evNutrition,nrn
    evStock,stk
    evMakeup,mkp
    evLife,lfe
    evHealth,hlt
    evYoga1,yg1
    evPaint,pnt
    evNone,evn
    evOil,oil
    evDot,dot
    evBlob,blb
    evSplash,spl
    evWire,wre
    evTree,tre
    evPoly,pol
    evBlob2,bl2
    evFlower,flr
    evBlob3,bl3
    evFlower2,fl2
    evCircle,crc
    evGeometry,geo
    evPattern,pat
    evSnow,snw
    `
    append_ucode(ev_backgrounds,'background2code','code2background')
    
    
    var post_bar_position = `
    right,r
    horizontal,h
    below,b
    `
    append_ucode(post_bar_position,'pBarPosition2code','code2pBarPosition')
    
    var playlist_style = `
    playlist_curiosity,d
    playlist_none,n
    playlist_large_thumbs,l
    playlist_horizontal_bg,h
    `
    append_ucode(playlist_style,'playlist2code','code2playlist')
    
    
    var player_icon = `
    Default,d
    Animated 1,a1
    Animated 2,a2
    Black Circle,bc
    White Circle,wc
    Black With Backgrond,bb
    White With Backgrond,wb
    None,n
    `
    append_ucode(player_icon,'playerIcon2code','code2playerIcon')

    var collapse_outline = `
    All But Active,ab
    Collapse All,a
    Collapse None,n
    `
    append_ucode(collapse_outline,'collapseOutline2code','code2ollapseOutline')
    
    
    var sections = `
    hero_resume_discovery_1,hrd1
    hero_rome,hrr
    lyon_features,lyf
    lisbon_features,lsf
    hamburg_features,hmf
    piraeus_hero,prh
    varanasi_hero,vrh
    tokyo_details,tdl
    palma_events,ple
    osaka_details,osd
    barcelona_hero,bch
    paris_hero,psh
    oxford_hero,oxh
    oxford_detail_1,oxd
    taipei_details,tad
    vienna_details,vid
    graz_detail,grd
    monaco_hero,mnh
    monaco_detail,mnd
    uppsala_details,upd
    lessons_discovery_1,ld1
    info_discovery_1,id1
    discovery_1_faq,d1f
    info_with_icons_discovery_1,lwid1
    announcement_2_discovery_1_,a1
    announcement_3_discovery_1,a3
    features_discovery_1,fd1
    hero_resume_discovery_2,hrd2
    info_discovery_2,id2
    list_discovery_2,ld2
    dashboard_announcement_discovery_2,da2
    hero_resume_discovery_3,hrd3
    lessons_1_discovery_3,l1d
    lessons_2_discovery_3,l2d
    lessons_3_discovery_3,l3d
    lessons_4_discovery_3,l4d
    lessons_5_discovery_3,l5d
    info_discovery_3,id3
    banner_discovery_3,bd3
    hero_resume_discovery_4,hrd4
    lessons_discovery_4,ld4
    lessons_discovery_4_1,ld41
    hero_resume_curiosity_1,hrc1
    category_tags_curiosity_1,ctc1
    lessons_curiosity_1,lc1
    hero_resume_curiosity_2,hrc2
    lessons_curiosity_2,lc2
    hero_resume_curiosity_3,hrc3
    lessons_curiosity_3,lc3
    lessons_curiosity_3_1,lc31
    hero_resume_curiosity_4,hrc4
    lessons_curiosity_4,lc4
    hero_resume_evolution,hre
    lesson_banner_evolution,lbe
    hero_curiosity_2,hc2
    hero_discovery_3,hd3
    hero_evolution,he
    hero_curiosity_3,hc3,
    lessons_3_discovery_3,l3d
    lessons_4_discovery_3,l4d
    lessons_5_discovery_3,l5d
    lessons_evolution,le
    video_banner_discovery_1,vb1
    video_banner_discovery_4,vb2
    categories_list_curiosity_1,cl1
    categories_list_curiosity_2,cl2
    categories_list_curiosity_3,cl3
    categories_list_curiosity_4,cl4
    categories_list_discovery_1,cl5
    categories_list_discovery_4,cl6
    category_list_curiosity_1,cs1
    category_list_curiosity_2,cs2
    category_list_curiosity_3,cs3
    category_list_curiosity_4,cs4
    category_list_discovery_1,cs5
    category_list_discovery_4,cs6
    categories_hero_discovery_1,clh
    category_hero_discovery_1,csh
    category_hero_discovery_1,csh
    dynamic_announcements,ds
    lesson_search,lsh
    lesson_filters_v1,lf1
    lesson_filters_v2,lf2
    lesson_filters_v3,lf3
    lesson_filters_v4,lf4
    `
    append_ucode(sections,'sections2code','code2sections')
    
    var sidebars = `
    secondary_sidebar_discovery_5,sd5
    secondary_sidebar_discovery_4,sd4
    secondary_sidebar_discovery_7,sd7
    secondary_sidebar_discovery_2,sd2
    secondary_sidebar_discovery_6,sd6
    secondary_sidebar_discovery_v1,sv1
    secondary_sidebar_evolution_1,se1
    secondary_sidebar_discovery_1,sd1
    main_sidebar_discovery_1,md1
    `
    append_ucode(sidebars,'sidebars2code','code2sidebars')
    
    var badges = `
    no_badge,nbg
    p_badges_4,bp4
    p_badges_5,bp5
    p_badges_6,bp6
    p_badges_7,bp7
    p_badges_8,bp8
    p_badges_9,bp9
    p_badges_10,bp10
    p_badges_11,bp11

    `
    append_ucode(badges,'badges2code','code2badges')

    var post_sections = `
    post_action_mobile_discovery_v1,pm
    post_tabs,pt
    post_body_mobile_discovery_v1,pb
    comments_discovery_v1,cd
    post_user_notes,pn
    post_chat,pc
    post_questions,pq
    post_related_posts,pr
    `
    append_ucode(post_sections,'psection2code','code2psection')
    })();
    
    
    

//console.log('colors.js')
//console.log('colors.js222')
//


class Colors{

    constructor(){
        this.cssVarsValues = [];
        this.pallete_selected = false
        this.six_colors = '--accent-color-1,--accent-color-2,--bg-color-1,--bg-color-2'
        this.palletes = PALLETES_light
        this.pickers = {}
        this.JTB_colorMode = 'White Mode'

        this.colorsOnload()
    }

    colorsOnload(){
        
        for (var item of this.six_colors.split(',')){
            let val = getComputedStyle(document.documentElement).getPropertyValue(item);
            this.cssVarsValues[item.replace('--','')] = val
            $('.tp_colors  li[data-color="'+item+'"] div').css('background-color',val)
        }
        
        this.intiatePickers()
        this.createColorPalettes()
        this.loadUrlColorMode()
        this.events()
    }


    events(){
        $('body').on('click','.pickr',function(){
            let item = $(this).closest('li').data('color');
            COLORS.pickers[item].show()
        });
    
        $('body').on('click','.topbar_color_palette',function(){
            let index = $(this).data('index')
            COLORS.paletteSelected(COLORS.palletes[index].colors)
            ROUTER.setUrl();
        })
        
        $('.cb_color_mode > div').click(function(){
            $('.cb_color_mode > div').removeClass('active')
            $(this).addClass('active')
            COLORS.colorModeClicked($(this).text())
        })
    }


    loadUrlColorMode(){
        if(IsR2){
            DEMO['colorMode'] = ROUTER.urlParm('cm')
        }
        var colorMode = DEMO.colorMode
        this.changeColorMode('Light')
        this.palletes = PALLETES_light
        this.createColorPalettes()
        DEMO.colorMode = 'l'
        $('.cb_color_mode > div').removeClass('active')
        $('.cb_color_mode > .u_left').addClass('active')
        if (colorMode){
            if (colorMode == 'd'){
                this.changeColorMode('Dark')
                this.palletes = PALLETES_dark
                this.createColorPalettes()
                DEMO.colorMode = 'd'
                $('.cb_color_mode > div').removeClass('active')
                $('.cb_color_mode > .u_right').addClass('active')
            }
        }
    }

    loadUrlColors(){
        var colors = ROUTER.urlParm('clr')
        if (colors){
                DEMO.colors = colors
                let palette  = colors.split('-')
                for (var i in palette){
                    palette[i] = '#'+palette[i]
                }
                this.paletteSelected(palette)

                let colorsR = colors.split('-')
                this.setColors(colorsR[0], colorsR[1], colorsR[2], colorsR[3], colorsR[4], colorsR[5])
        } else {
            this.setColors('#005ffe', '#fadc4a', '#F4F5FC', '#FFFFFF', '#000000', '#777777')
        }
    }

    colorModeClicked(mode){

        this.changeColorMode(mode)

        var accent1 = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-1').replace('#','');
        var accent2 = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-2').replace('#','');
        DEMO.colors = accent1 + '-' + accent2 + '-'
        DEMO['color-mode'] = {}
        
        if (mode == 'Dark'){
            this.palletes = PALLETES_dark
            var bg1 = '141313'
            var bg2 = '1F1F1F'
            DEMO.colorMode = 'd'
        } else {
            this.palletes = PALLETES_light
            var bg1 = 'F4F5FC'
            var bg2 = 'FFFFFF'
            DEMO.colorMode = 'l'
        }

        DEMO.colors += bg1 + '-' + bg2
        $('.tp_colors  li[data-color="--bg-color-1"] div').css('background-color','#'+bg1)
        $('.tp_colors  li[data-color="--bg-color-2"] div').css('background-color','#'+bg2)
        this.setCssVar('--bg-color-1','#'+bg1)
        this.setCssVar('--bg-color-2','#'+bg2)
        this.pickers["--bg-color-1"].setColor('#'+bg1)
        this.pickers["--bg-color-2"].setColor('#'+bg2)
        this.createColorPalettes()

        TOPBAR.changed('colors')
        ROUTER.setUrl()
    }
    
    intiatePickers(){
        for (var item of this.six_colors.split(',')){
            this.pickers[item] = Pickr.create({
                el: '.tp_colors  li[data-color="'+item+'"] div',
                theme: 'classic',
                default: this.cssVarsValues[item.replace('--','')].trim(),
                item:item,
                components: {
                    preview: true, opacity: true, hue: true,
                    interaction: {
                        hex: true, rgba: true, input: true, save: true , cancel: true
                    }
                }
            });
            this.pickers[item].on('save', (color, instance) => {
                instance.hide()
                if (!this.pallete_selected){
                    this.getVarColorsAndsetUrl()
                }
                this.pallete_selected = false
    
            })
            this.pickers[item].on('change', (color,eventSource, instance) => {
                let item = instance.options.item
                this.setColorVar(item,color)
            })
            this.pickers[item].on('hide', ( instance) => {
                let item = instance.options.item
                let color = instance.getSelectedColor()
                this.setColorVar(item,color)
            })
            this.pickers[item].on('cancel', ( instance) => {
                let item = instance.options.item
                let color = instance.getSelectedColor()
                this.setColorVar(item,color)
                instance.hide()
            })    
        }
    }
    
    setColorVar(item,color){
        var color_val = color.toRGBA().toString(0).replace(/ /g,'')
        let alpha = color.toRGBA()[3]
        if ( alpha == 1){
            color_val = color.toHEXA().toString()
        }
        //console.log(color_val)
        document.querySelector(':root').style.setProperty(item, color_val);
        let c = color.toRGBA().toString(0).replace(')','').replace('rgba(','').split(',')
        //console.log(c)
        let rgb = c[0]+','+c[1]+','+c[2]
        document.querySelector(':root').style.setProperty(item+ '-rgb', rgb);
    
        this.cssVarsValues[item.replace('--','')] = color_val
    }
    
    paletteSelected(palette){
        var i = 0;
        var  demoColors = [];
        for (var item of this.six_colors.split(',')){
            let val = palette[i]
            $('.tp_colors  li[data-color="'+item+'"] div').css('background-color',val)
            this.pallete_selected = true;
            this.pickers[item].setColor(val)
            document.querySelector(':root').style.setProperty(item, val);
            document.querySelector(':root').style.setProperty(item+ '-rgb', this.hexToRgb(val));
            demoColors.push(val.replace('#',''))
            this.cssVarsValues[item.replace('--','')] = val
            i++;
        }
        DEMO.colors = demoColors.join('-')
    
        TOPBAR.changed('colors')
    }
    
    
    getVarColorsAndsetUrl(){
        var  demoColors = [];
        for (var item of this.six_colors.split(',')){
            let val = getComputedStyle(document.documentElement).getPropertyValue(item);
            demoColors.push(val.trim().replace('#','').replace(/,/g,'|'))
        }
        DEMO.colors = demoColors.join('-')
    
        ROUTER.setUrl();
        TOPBAR.changed('colors')
    
    }
    
    
    createColorPalettes(){
        $('.tp_color_palletes_wrap').html('')
        for (var x=0;x<this.palletes.length;x++ ){
            let $wrap = $('<div class="color_2 swiper-slide"></div>')
            var newPalleteHtml = this.createApallete(this.palletes[x],x)
            $wrap.append(newPalleteHtml)
            x++;
            newPalleteHtml = this.createApallete(this.palletes[x],x)
            $wrap.append(newPalleteHtml)
            $('.tp_color_palletes_wrap').append($wrap)
            colorsSwiper.update()
        }
    }
    
    
    createApallete(palette,index){
        var palleteTemplate =`
        <div class="tp_pallete_item_wrap">
            <div class="tp_pallete_name">{name}</div>
            <div class="topbar_color_palette" data-index="{index}"> 
                <div class="cb_palette_colors cb_palette_accent">
                <div><div class="cb-pal-box brl" data-color="--accent-1" style="background-color:1"></div><span>{=1}</span></div>
                <div><div class="cb-pal-box" data-color="--accent-2" style="background-color:2"></div><span>{=2}</span></div>
                </div>
                <div class="cb_palette_colors cb_palette_bg">
                <div><div class="cb-pal-box" data-color="--light-1" style="background-color:3"></div>
                <div><div class="cb-pal-box brr" data-color="--light-2" style="background-color:4"></div></div>
    
                </div>
            </div>
        </div>`
    
        var colors_ri = palette.colors
        palleteTemplate = palleteTemplate.replace('{index}',index)
        palleteTemplate = palleteTemplate.replace('{name}',palette.name)
        for(i=1;i<this.palletes.length;i++){
            let re = new RegExp(':'+i,"g");
            palleteTemplate = palleteTemplate.replace(re,':'+colors_ri[i-1])
            let re1 = new RegExp('{='+i+'}', "g")
            if(colors_ri[i-1]){
                palleteTemplate = palleteTemplate.replace(re1,colors_ri[i-1])
            } else{
                palleteTemplate = palleteTemplate.replace(re1,'')
            }
            
        }
        return palleteTemplate;
    
    }
        
    hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? parseInt(result[1], 16) + ',' + parseInt(result[2], 16) + ',' + parseInt(result[3], 16) : null;
    }

    setRgbaVars(){
        var root = document.documentElement;
        for (var item of this.six_colors.split(',')){
            let val = getComputedStyle(document.documentElement).getPropertyValue(item);
            var rgbVal = this.hexToRgb(val.trim());
            if (val.includes('rgb')){
                rgbVal = val.replace(')','').replace('rgb(','').replace('rgba(','').trim().split(',')
                rgbVal = rgbVal[0]+','+rgbVal[1]+','+rgbVal[2]
            }
            root.style.setProperty(item+'-rgb',rgbVal );
        }
    }


    changeColorMode(val){
        var accent1 = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-1');
        var accent2 = getComputedStyle(document.documentElement).getPropertyValue('--accent-color-2');
        var bg1 = getComputedStyle(document.documentElement).getPropertyValue('--bg-color-1');
        var bg2 = getComputedStyle(document.documentElement).getPropertyValue('--bg-color-2');
        accent1 = accent1.padStart(6, '0')
        accent2 = accent2.padStart(6, '0')
        bg1 = bg1.padStart(6, '0')
        bg2 = bg2.padStart(6, '0')
        if (val == 'Light'){
            this.setColors(accent1,accent2,bg1,bg2,'#000000','#161515')
            $('body').removeClass('dark')
            this.JTB_colorMode = 'White Mode'
        }
        if (val == 'Dark'){
            this.setColors(accent1,accent2,bg1,bg2,'#FFFFFF','#F2F2F2')   
            $('body').addClass('dark')
            this.JTB_colorMode = 'Dark Mode'
        }
    }


    setColors(accent1,accent2,bg1,bg2,text1,text2){
        accent1 = accent1.trim().padStart(6, '0')
        accent2 = accent2.trim().padStart(6, '0')
        bg1 = bg1.trim().padStart(6, '0')
        bg2 = bg2.trim().padStart(6, '0')
        this.setCssVar('--accent-color-1',accent1)
        this.setCssVar('--accent-color-2',accent2)
        this.setCssVar('--bg-color-1',bg1)
        this.setCssVar('--bg-color-2',bg2)
        this.setCssVar('--text-color-1',text1)
        this.setCssVar('--text-color-2',text2)

        DEMO.colors = accent1.replace('#','') + '-' + accent2.replace('#', '') + '-' + bg1.replace('#', '') + '-' + bg2.replace('#', '')
        this.setRgbaVars()
    }
    
    setCssVar(name,val){
        if (val == undefined || val == ''){return}
        if (!val.includes('#') && !val.includes('rgb')){
            if (val.includes('rgb')){
                val = val.replace(/|/g,',')
            }
            val = '#'+val
        }
        document.querySelector(':root').style.setProperty(name, val);
    }

}







//console.log('sliders')

function initiateSliders(){

    var sliderOptions = 
        { effect: 'slide' , 
            centeredSlides: false,
            speed: 500,
            loop: false,
            navigation:{
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            }
        }

     demosSwiper = new Swiper('.demos-swiper-container', {
        ...sliderOptions,
        slidesPerView: Math.floor(window.innerWidth / 270),
        spaceBetween: 10
      });

    layoutSwiper = new Swiper('.layout-swiper-container', {
        ...sliderOptions,
        slidesPerView: 'auto'
      });

    sectionsSwiper = new Swiper('.sections-swiper-container', {
        ...sliderOptions,
        slidesPerView: 'auto',
        spaceBetween: 10,
      });
    backgroundSwiper = new Swiper('.r3_background_wrapper', {
      ...sliderOptions,
      slidesPerView: 'auto',
      spaceBetween: 10
    })
    colorsSwiper = new Swiper('.colors-swiper-container', {
        ...sliderOptions,
        slidesPerView: Math.floor(window.innerWidth / 230),
        spaceBetween: 10
      });
    sidebarSwiper = new Swiper('.sidebar-swiper', {
      ...sliderOptions,
      slidesPerView: 2.7,
      spaceBetween: 10
    })
    new Swiper('.headers_layout', {
        ...sliderOptions,
        slidesPerView: 1.5,
        spaceBetween: 10
      });
      new Swiper('.post-swiper-container', {
        ...sliderOptions,
        slidesPerView: Math.floor(window.innerWidth / 200),
        spaceBetween: 10
      });
    postSectionSwiper = new Swiper('.post-sections-swiper-container', {
        ...sliderOptions,
        slidesPerView: Math.floor(window.innerWidth / 200),
        slidesPerView: "auto",
        spaceBetween: 10
      });
    progressSwiper = new Swiper('.progress_swiper', {
      ...sliderOptions,
      slidesPerView: 'auto',
      spaceBetween: 10
    });
    badgeSwiper = new Swiper('.badges_swiper', {
      ...sliderOptions,
      slidesPerView: 'auto',
      spaceBetween: 10
    });
    // sidebarSwiper.update()
      demosSwiper.on('sliderMove', demosSwiperOnMove)
      function demosSwiperOnMove(){
          demosSwiper.off('sliderMove', demosSwiperOnMove)
          DEMOS.populateBrowseDemosImages(20,1000, false)
          demosSwiper.update()
      }
}


//console.log('topbar')

OUTLINE_BLOCK_IDS = []
TBAR_CHANGES = []

class Topbar{

    constructor(){
        this.isPreviewMode = false
        this.beforeChanges = {}
        this.saveState = true
        this.topbarInit()
        this.events()
    }

    topbarInit(){

        if($('body').hasClass('dark')){
            DEMO.colorMode = "d"
            $('.cb_color_mode > div').removeClass('active')
            $('.cb_color_mode > .u_right').addClass('active')
        } else{
            DEMO.colorMode = "l"
            $('.cb_color_mode > div').removeClass('active')
            $('.cb_color_mode > .u_left').addClass('active')
        }
        
        initiateSliders()
    
        $('.r3_tabs > div').hide()
        $('.r3_demos_tab').show()
        
        if(PAGE != HOMEPAGE){
            $('.r3_tab_btns >div[tab="layout"]').hide()
            $('.r3_tab_btns >div[tab="sections"]').hide()
            $('.r3_tab_btns div[tab="progress"]').hide()
        } else if(PAGE != 'post'){
            $('.r3_tab_btns >div[tab="post_layout"]').hide()
            $('.r3_tab_btns >div[tab="features"]').hide()
            $('.r3_tab_btns >div[tab="post_sections"]').hide()
            $('.more-wrapper div[tab="demos"], .more-wrapper div[tab="colors"], .more-wrapper div[tab="outline"]').hide()
            $('div[tab="postbar"]').hide()
        } 
        if(PAGE == 'post'){
            $('.r3_tab_btns >div[tab="demos"], .r3_tab_btns >div[tab="colors"], .r3_tab_btns >div[tab="outline"], .r3_tab_btns >div.sidebars-tab').hide()
            $('.r3_tab_btns >div[tab="demos"]').removeClass("active")
            $('.r3_tab_btns >div[tab="post_layout"]').addClass("active")
            $('.r3_demos_tab').hide()
            $(".r3_post_layout").show()
            $(".back_to_dashbaord").show()
        }
    }

    events(){ 
        $('.r3_tab_btns [tab]').click(function(){
            TOPBAR.tabClicked($(this))
        })

        $('.more-wrapper > div').click(function(){
            TOPBAR.moreTabClicked($(this))
        })

        $('.sidebar-dropdown > div').click(function(){
            TOPBAR.sidebarTabClicked($(this))
        })
        $('.sidebar-collection > div').click(function(){
            TOPBAR.changeSbar($(this))
        })
        $('.sidebar-dropdown > div').hover(function(){
            TOPBAR.highlightSideBar($(this))
        }, function(){
            TOPBAR.removeHighlightSidebar($(this))
        })
        $('.r3_layout_wrapper > div').click(function(){
            SIDEBARS.layoutSelected($(this))
        })
    
        $('.r3_bar_toggle').click(function(){
            TOPBAR.toggleTopbar()
        })
        $(".demos-filter input").on('click', function(){
            DEMOS.populateBrowseCompleted = false
            DEMOS.populateBrowseDemosImages(0,1000, true)
            demosSwiper.update()
        })
        $('.r3_post_wrapper > div').click(function(){
            POST.postLayoutSelected($(this).attr('post_conf'), $(this).attr('tp'))
        })
        $(".r3_post_sections_wrapper > div").click(function(){
            FEATURES.postSectionsSelected($(this).attr('post_tabs'), $(this).attr('post_sections'))
        })
        $('.r3_background_wrapper > div > div').click(function(){
            TOPBAR.changed('background')
            var name = $(this).attr('name')
            ROUTER.changeBackgroud(UCODE.code2background[name], false)
        })
        if (!IsR2){
            $('.apply_button').click(function(e){
                e.stopPropagation()
                TOPBAR.openPopBeforeApply()
            })
            $('body').on('click','.PopCannotSave_close', ()=>{
                $('.p_change_confirm_popup').remove()
                $('[data-section-id]').attr('not-dirty','true')
                this.startNotDirtyTimer()
            })
            $('body').on('click','.discard_button', ()=>{
                this.discardChanges()
            })
        }

        $('.top_padding_dashboard input').keyup(() => {
            SIDEBARS.changeContentPadding($('.top_padding_dashboard input').val())
            ROUTER.setUrl()
        })

        $('.top_padding_post input').keyup(() => {
            POST.changePostContentPadding($('.top_padding_post input').val()) 
            ROUTER.setUrl()
        })
        $('.close-sbar').click(function(){
            TOPBAR.closeSidebarWrap()
        })
        $(".sidebar_drag_wrapper").click(function(event){
            if(!$(event.target).closest('.sidebar_drag').length && !$(event.target).is('.sidebar_drag')) {
            TOPBAR.closeSidebarWrap()
            }
        })

        $(".back_to_dashbaord").click(function(){
            PAGE = 'dashboard'
            window.location.href =  ROUTER.setUrl(true)
        })

        $('body').on('mouseover','.after_install_triger',function(){
            $('.after_install_pop').show()
        })
        $('body').on('mouseleave','.after_install_triger',function(){
            $('.after_install_pop').hide()
        })
 
    }


    highlightSideBar($this){
        $('.main_sidebar_wrap').removeClass('highlight_sidebar')
        var hasMainBar = $('.p_wrap_out').hasClass('show_main_sidebar')
        var hasSecondBar = $('.sidebar').css('display') != 'none'
        $this.attr('tab')
        if(!hasMainBar){
            $this.addClass('disable-sidebar')
        }
        if(!hasSecondBar){
            $this.addClass('disable-sidebar')
        }
        if($this.attr('tab') == 'mainbar' && hasMainBar) {
            $this.removeClass('disable-sidebar')
            $('.main_sidebar_wrap').addClass('highlight_sidebar')
        } else{
            $('.main_sidebar_wrap').removeClass('highlight_sidebar')
        }

        if($this.attr('tab') == 'secondbar' && hasSecondBar){
            $this.removeClass('disable-sidebar')
            $('.sidebar').addClass('highlight_sidebar')
        } else {
            $('.sidebar').removeClass('highlight_sidebar')
        }

        if($this.attr('tab') == 'postbar'){
            $this.removeClass('disable-sidebar')
            $('.post_sidebar_section > section').addClass('highlight_sidebar')
        }
    }
    removeHighlightSidebar($this) {
        $('.sidebar').removeClass('highlight_sidebar')
        $('.main_sidebar_wrap').removeClass('highlight_sidebar')
        $('.post_sidebar_section > section').removeClass('highlight_sidebar')
    }
    moreTabClicked($this){
        $('.more_hover').attr('tab', $this.attr('tab'))
        $('.more-wrapper').hide()
        setTimeout(function (){
            $('.more-wrapper').attr('style','')
        },500)
    }
    closeSidebarWrap(){
        $('.sidebar_drag_wrapper').hide()
        $('.sidebar_drag').removeClass('open').removeClass("s-left").removeClass('left-260').removeClass("s-right").removeClass('mainbar').removeClass('secondbar').removeClass('postbar')
        TOPBAR.tabClicked($('.r3_tab_btns > div:first-child'))
    }
    sidebarTabClicked($this){
        if($this.hasClass('disable-sidebar')){return}
        sidebarSwiper.update()
        var sidebarPosition = "s-left"
        var tab = $this.attr('tab')
        var innerWidth = $('.p_wrap_out').innerWidth() / 2
        //console.log(tab)
        if(tab == 'mainbar'){
            $('div[sbar="main_sidebar_discovery_1"]').show()
            var mainSidebarPosition = $('.p_outline_out').position().left
            if(innerWidth > mainSidebarPosition){
                sidebarPosition = "s-right"
            } else {
                sidebarPosition = "s-left"
            }
        } else if(tab == 'secondbar'){
            $('div[sbar="main_sidebar_discovery_1"]').hide()
            var secondBarPosition = $('.sidebar').position().left
            if(innerWidth > secondBarPosition){
                sidebarPosition = "s-right"
            } else {
                sidebarPosition = "s-left"
            }
        }
        $('.r2_topbar,.r3_topbar').css('height','49px')
        $('.p_wrap_out').css('padding-top','49px')
        $('.sidebars-tab').attr('tab', tab)
        $('.sidebar-dropdown').hide()
        setTimeout(function (){
            $('.sidebar-dropdown').attr('style','')
        },500)
        $('.sidebar_drag').removeClass("s-left").removeClass("s-right").removeClass('open').removeClass('mainbar').removeClass('secondbar').removeClass('postbar')
        $('.sidebar_drag').addClass(sidebarPosition).addClass('open').addClass(tab)
        if(IsR2){
        if(!$(".r2_sidebar").hasClass("close-r2sidebar")){
            $(".s-left").addClass("left-260")
        }
    }
        $('.sidebar_drag_wrapper').show()
        sidebarSwiper.update()
    }
    changeSbar($this){
        TOPBAR.changed('sidebars')
        var sbarFor = $('.sidebars-tab').attr('tab')
        var badgePosition;
        
        if(sbarFor == "mainbar"){
            if($this.attr('sbar') == "no_sidebar"){
                DEMO['show_main_bar'] = "f"
                DEMO.sidebars = DEMO.sidebars.replace("MSt", "MSf")
                SIDEBARS.hideMainBar()
                ROUTER.setUrl()
                return
            }
            DEMO['mainBar'] = UCODE.sidebars2code[$this.attr('sbar')]
            LAYOUT.setMainBar($this.attr('sbar'))
            badgePosition = "m"
        } else if(sbarFor == "secondbar"){
            if($this.attr('sbar') == "no_sidebar"){
                DEMO['show_second_bar'] = "f"
                DEMO.sidebars = DEMO.sidebars.replace("SSt", "SSf")
                SIDEBARS.toggleSbar("f")
                ROUTER.setUrl()
                return
            }
            DEMO['secondBar'] = UCODE.sidebars2code[$this.attr('sbar')]
            SIDEBARS.setSecondBar($this.attr('sbar'))
            badgePosition = "s"
        }
        if($this.attr('badge')){
            var badge = $this.attr('badge')
            var badgeIndex = $this.attr("badgeIndex")
            DEMO.badgeIndex = parseInt(badgeIndex)
            DEMO['badges'] = UCODE.badges2code[badge]
            DEMO.badge_position = badgePosition
            ROUTER.setUrl()
            BADGES.loadBadges()
        } else{
            DEMO['badges'] = ""
            DEMO.badge_position = ""
            ROUTER.setUrl()
        }
        
    }
    tabClicked($this){
        notific_hide()

        if ($this.hasClass('more_hover') || $this.hasClass('.sidebars-tab')){return}
        $('.r3_tab_btns > div').removeClass('active')
        $this.addClass('active')
    
        $('.r3_tabs > div').hide()
        var tab = $this.attr('tab')
        $('.r3_tabs > div[tab="'+tab+'"]').show()
        if (tab == 'demos' ){
            notific_write('Select a demo as your starting point. You will be able to change your demo at any time <span class="after_install_triger">after installing the template on your Kajabi account</span>')
        }
        else if (tab == 'outline' ){
            notific_write('Note: The top bar with all its features will be available for use inside your Kajabi account. - <span class="after_install_triger">Learn more</span>')
        }
        else if (tab == 'sections' ){
            notific_write('Select a preset to replace all your dashboard\'s dynamic sections or use the “Add Section” button on the left sidebar to add or remove single sections')
           $('.r2_topbar,.r3_topbar').css('height','248px')
           $('.p_wrap_out').css('padding-top','248px')
           setTimeout(function (){{
            sectionsSwiper.update()
        }},500)
        } else if (tab == 'progress'){
            setTimeout(function (){{
                progressSwiper.update()
            }},500)
        } else if (tab == 'badges'){
            notific_write('Control the badges, stage, images, and caption <span class="after_install_triger">after installing the template on your Kajabi account.</span> Display badges on your dashboard and end-of-lesson popups.')
            setTimeout(function (){{
                badgeSwiper.update()
            }},500)
        } else if (tab == 'background'){
            notific_write('You will be able to set your own background, top, and bottom images <span class="after_install_triger">after installing the template on your Kajabi account.</span>')
            setTimeout(function (){{
                backgroundSwiper.update()
            }},100)
        } else if(tab == "layout"){
            notific_write('Control your dashboard layout, sidebar position, content width, and document padding.')
            setTimeout(function (){{
                layoutSwiper.update()
            }},100)
        } else if(tab == "post_sections"){
            notific_write('Choose one of the presets below or use the “Sections Custom” tab for custom control.  Further control your post page features <span class="after_install_triger">after installing the template on your account.</span>')
            setTimeout(function(){
                postSectionSwiper.update()
            },100)
        } else if(tab == "post_layout"){
            notific_write('Control your post page layout, sidebar position, content width, and document padding.')
            setTimeout(function(){
                postSectionSwiper.update()
            },100)
        } else if(tab == "features"){
            notific_write('Drag sections into the tab-box to display the section in the tabs area, or out of the tab-box to display the section above or below the tabs.')
            setTimeout(function(){
                postSectionSwiper.update()
            },100)
        } else {
           
           let height = 190 + NOTIFIC_height
           $('.r2_topbar,.r3_topbar').css('height',height+'px')
           $('.p_wrap_out').css('padding-top',height+'px')
        }
    }

    
    toggleTopbar(){
        if(!IsR2){
            this.saveStateBeforeChanges()
        }

        $('.r3_topbar').css('overflow','hidden')
        if ($('.r3_bar_toggle i').hasClass('fa-caret-down')){
            this.collapseTopbar()
            if (!this.isPreviewMode){
                $('.clmn_show_grids-false').removeClass('clmn_show_grids-false').addClass('clmn_show_grids-true')
            }
        } else {
            this.OpenTopar()
        }
     }

     OpenTopar(){
        $('.clmn_show_grids-true').removeClass('clmn_show_grids-true').addClass('clmn_show_grids-false')
        this.getOutlineBlockIds()

        var barHeight = 190 + NOTIFIC_height
        if ($('.r3_tab_btns div[tab="sections"]').hasClass('active')){
            barHeight = 248  + NOTIFIC_height
        }
        $('.r3_bar_toggle i').removeClass('fa-caret-up')
        $('.r3_bar_toggle i').addClass('fa-caret-down')
        $('.r2_topbar, .r3_topbar').css('height',barHeight+'px')
        $('.p_wrap_out').css('padding-top',barHeight+'px').addClass('r2Open')     

        $('.toggle-sidebar').css('top','350px')
        $('.r2-toggle').css('top','300px')
       
        setTimeout(function(){
            $('.r3_topbar').css('overflow','visible')
        },200)
     }

     collapseTopbar(){
        $('.r3_topbar').css('overflow','hidden')
        $('.r3_bar_toggle i').removeClass('fa-caret-down')
        $('.r3_bar_toggle i').addClass('fa-caret-up')
        $('.r2_topbar, .r3_topbar').css('height','0px')
        $('.p_wrap_out').css('padding-top','0px').removeClass('r2Open')

        $('.toggle-sidebar').css('top','250px')
        $('.r2-toggle').css('top','200px')
     }

     previewModeStart(){
        this.isPreviewMode =  true
        this.trackSaveClickedOnEditor()
        this.showPreviewModeButtons()

        $('[kjb-settings-id]').removeAttr('kjb-settings-id')
     }

     trackSaveClickedOnEditor(){
        $('body').append('<div class="original_sections" style="display:none;"></div>')
        var st = ''
        $('[data-dynamic-sections] > div').each(function (){
            let sectionId =  $(this).attr('data-section-id')
            st+= `<div id="section-${sectionId}" data-section-id="${sectionId}"></div>`
        })
        $('.original_sections').append(st)
   
        $('[data-section-id]').attr('not-dirty','true')
        this.startNotDirtyTimer()
     }

     showPreviewModeButtons(){
        $('.tbar_buttons').css('bottom','0px')
     }


     startNotDirtyTimer(){
        this.NotDirtyTimer = setInterval(()=>{
            if($('[data-section-id]:not([not-dirty])').length != 0){
                this.showPopCannotSave()
                clearInterval(this.NotDirtyTimer)
            }
        },1000)
     }

     saveStateBeforeChanges(){
        if (this.saveState){
            this.saveStateSelectors = ['.main-content','#section-p_header','.p_outline_out','.color_vars','.background_images-style','.button_presets']
            for (var selector of this.saveStateSelectors){
                this.beforeChanges[selector] = $(selector)[0].outerHTML
            }

            this.beforeChanges['p_wrap_out__class'] = $('.p_wrap_out').attr('class')
            this.beforeChanges['p_wrap_out__style'] = $('.color_vars').attr('style')

            if ($('.toggle-sidebar').length == 0){
                this.beforeChanges['toggle-sidebar'] = 'remove'
            } else {
                this.beforeChanges['toggle-sidebar'] = $('.toggle-sidebar').attr('style')
            }

            this.saveState = false
        }
     }


     discardChanges(){
        //$('.clmn_show_grids-false').addClass('clmn_show_grids-true').removeClass('clmn_show_grids-false')
        $('html').attr('style','')
        $('.sidebar_styles').html('.show_only_on_postdisplay: none;}')
        $('.dynamic_styles').html('')
        $('.progress_styles').html('')
        
        this.saveStateSelectors = ['.main-content','#section-p_header','.p_outline_out','.color_vars','.background_images-style','.button_presets']
        for (var selector of this.saveStateSelectors){
            $(selector).replaceWith(this.beforeChanges[selector])
        }
        
        $('.p_wrap_out').attr('class',this.beforeChanges['p_wrap_out__class'])
        $('.p_wrap_out').attr('style',this.beforeChanges['p_wrap_out__style'])

        if (this.beforeChanges['toggle-sidebar'] == 'remove'){
            $('.toggle-sidebar').remove()
        } else {
            $('.toggle-sidebar').attr('style',this.beforeChanges['toggle-sidebar'])
        }

        this.collapseTopbar()
        $('.tbar_buttons').css('bottom','-70px')

        clearInterval(this.NotDirtyTimer)
        this.saveState = true
        this.isPreviewMode = false
        this.clearGlobals()
     }

     clearGlobals(){
        TBAR_CHANGES = []
        DEMO = {}
        SIDEBAR_SETTINGS = {}
        JTB_playlistIsBlock = false
        JTB_overwrite = {}
        JTB_ProgressOverwrites = {}
        JTB_BadgeOverwrites = {}
        JTB_outlineName = ''
        JTB_outlineOverwrites = {}
        JTB_playlistOverwrites = {}
        JTB_playlistName = ''
        JTB_postSections = {}
        JTB_headerOverwrites = {}
        JTB_headerName = ''

        BAP.sidebars_defaults()
     }

     showPopCannotSave(){
        var popup = `
        <div class='p_change_confirm_popup'>
          <div class='p_change_confirm_wrap PopCannotSave'>
            <div class='p_change_confirm_text'>
              <h3>Cannot apply changes</h3>
              <p>Cannot apply any changes using the sidebar while in Preview Mode</p>
              <p>To exit Preview Mode click Apply Changes or Discard Changes below</p>
            </div>
            <div class='p_change_confirm_buttons'>
                <button class='PopCannotSave_close'><span>Close</span></button>
            </div>
          </div>
        </div>
      `
      $('body').append(popup)
     }



     permantLostMessage(){
        var msg = [];
        if (TBAR_CHANGES.includes('change_layout')){
            msg.push('Template Sidebars (Partial Loss)')
        }    
        if (TBAR_CHANGES.includes('change_post_layout')){
            msg.push('Some of the Template Sidebars (Partial Loss)')
        }  
        if (TBAR_CHANGES.includes('change_post_sections')){
            msg.push('All Post Page Dynamic Sections')
        } 
        if (TBAR_CHANGES.includes('outline')){
            msg.push('Outline Block')
        } 
        if (TBAR_CHANGES.includes('colors')){
            msg.push('Template Colors')
        } 
        if (TBAR_CHANGES.includes('dynamic_sections')){
            msg.push('All Dynamic Sections')
        } 
        if(TBAR_CHANGES.includes('header')){
            msg.push('Header')
        }
        if(TBAR_CHANGES.includes('progress')){
            msg.push('Progress Block')
        }
        if(TBAR_CHANGES.includes('badges')){
            msg.push('Badges')
        }
        if(TBAR_CHANGES.includes('background')){
            msg.push('Template Background')
        }
        if(TBAR_CHANGES.includes('sidebars')){
            msg.push('Template Sidebars (Partial Loss)')
        }
        if (TBAR_CHANGES.includes('demo')){
            msg = [];
            msg.push('<b>ALL</b> PREVIOUS CUSTOMIZATION WILL BE LOST')
        }
        this.LOST_MSG = ''
        for (row of msg){
            this.LOST_MSG += '<li style="line-height: 2;">'+row+'</li>'
        }
     }
     
     
     openPopBeforeApply(){
        this.permantLostMessage()
        var popup = `
        <div class='p_change_confirm_popup'>
          <div class='p_change_confirm_wrap'>
            <div class='p_change_confirm_text'>
              <h3>Are You Sure?</h3>
              <p>You are about to overwrite some of your template settings.</p>
              <p class="lma_p" style="margin-top: -10px; margin-bottom: 29px;">You will not be able to undo those changes.</p>
              <p class="lma_u" style="margin-top: -8px;font-weight: 700;">Any changes made to the components listed below will be permanently lost:</p>
              <ul style="margin-left: 16px;">
                ${this.LOST_MSG}
              </ul>
            </div>
            <div class='p_change_confirm_buttons'>
                <button class='p_cancel_confirm'><span>No</span></button>
                <button class='p_confirm_change'><span>Yes</span></button>
            </div>
          </div>
        </div>
      `
      $('body').append(popup)
      $('body').on('click','.p_cancel_confirm', function(){
        $('.p_change_confirm_popup').hide()
        $('.p_cancel_confirm').off('click')
        $('.p_confirm_change').off('click')
        return false
      })
      $('body').on('click','.p_confirm_change', function(){
        $('.p_change_confirm_popup').hide()
        $('.p_change-template').hide()
        TOPBAR.applyChanges()
        
      })
     }
    

    applyChanges(){
        var payloads = {}
        if (TBAR_CHANGES.includes('demo')){
            payloads= this.bapChangeDemo(payloads)
        } else {
            if (TBAR_CHANGES.includes('change_layout')){
                payloads = this.bapChangeLayout(payloads)
            }    
            if (TBAR_CHANGES.includes('change_post_layout')){
                payloads = this.bapChangePostLayout(payloads)
            }  
            if (TBAR_CHANGES.includes('change_post_sections')){
                payloads = this.bapChangePostSections(payloads)
            } 
            if (TBAR_CHANGES.includes('outline')){
                payloads = this.bapChangeOutline(payloads)
            } 
            if (TBAR_CHANGES.includes('colors')){
                payloads = this.bapChangeColors(payloads)
            } 
            if (TBAR_CHANGES.includes('dynamic_sections')){
                payloads = this.bapChangeDynamicDections(payloads)
            } 
            if(TBAR_CHANGES.includes('header')){
                payloads = this.bapChangeHeader(payloads)
            }
            if(TBAR_CHANGES.includes('progress')){
                payloads = this.bapChangeProgress(payloads)
            }
            if(TBAR_CHANGES.includes('badges')){
                payloads = this.bapChangeBadges(payloads)
            }
            if(TBAR_CHANGES.includes('background')){
                payloads = this.bapChangeBackground(payloads)
            }
            if(TBAR_CHANGES.includes('sidebars')){
                payloads = this.bapChangeSidebars(payloads)
            }
        }
        
        $('#payload').val(JSON.stringify(payloads))
        $('#payload_flag').val(Math.floor(Math.random() * 99999999999))
    }
    
    bapChangeDemo(payloads){
        //console.log(JTB_overwrite)
        var settingsDataSt = BUILD.bapBuildClicked()
        var settingsData = JSON.parse(settingsDataSt)
        var obj = {
            settingsData:settingsData,
        }
        payloads['demo'] = obj
        //console.log(payloads)
        return payloads
    
    }
    
    bapChangeOutline(payloads){
        var obj = {
            outline:DEMO['outline'],
            blockIds:OUTLINE_BLOCK_IDS,
            outline_overwrite: JTB_outlineOverwrites
        }
        payloads['outline'] = obj
        return payloads
    }
    
    getOutlineBlockIds(){
        $('.nblock-outline').each(function (){
            OUTLINE_BLOCK_IDS.push($(this).attr('id').replace('block-',''))
        })
    }
    
    bapChangeColors(payloads){
        var obj = {
            "color-mode":DEMO['colorMode'],
            "colors":DEMO['colors']
        }
        payloads['colors'] = obj
        return payloads
    }

    bapChangeHeader(payloads){
        var obj = {
            "header": UCODE.code2headers[DEMO["header"]],
            "top_padding": DEMO["contentTopPadding"]
        }
        payloads['headers'] = obj
        return payloads
    }
    bapChangeProgress(payloads){
        var obj = {
            "progress": DEMO.progress,
            "overwrite": JTB_ProgressOverwrites,
            "sidebar": DEMO.progress_sidebar
        }
        payloads['progress'] = obj
        //console.log(payloads)
        return payloads
    }
    bapChangeBadges(payloads){
        var obj = {
            "badges": JTB_overwrite,
            "overwrite": JTB_BadgeOverwrites,
            "sidebar": DEMO.badge_position_name
        }
        payloads['badges'] = obj
        //console.log(payloads)
        return payloads
    }
    bapChangeBackground(payloads){
        var obj = {
            "background": DEMO['background'],
            "overwrite": JTB_overwrite
        }
        payloads['background'] = obj
        //console.log(payloads)
        return payloads
    }
    bapChangeSidebars(payloads){
        var obj = {
            "sidebars": JTB_overwrite
        }
        payloads['sidebars'] = obj
        //console.log(payloads)
        return payloads
    }
    bapChangeDynamicDections(payloads){
        var obj = {
            "dynamicSections":DEMO['sections']
        }
        payloads['dynamicSections'] = obj
        return payloads
    }
    
    bapChangeLayout(payloads){
        var obj = {
            "changeLayout":JTB_overwrite
        }
        payloads['changeLayout'] = obj
        return payloads
    }
    
    bapChangePostLayout(payloads){
        var obj = {
            "changePostLayout":JTB_overwrite,
            "playlist_name": JTB_playlistName,
            "playlistIsBlock": JTB_playlistIsBlock
        }
        payloads['changePostLayout'] = obj
        //console.log(payloads)
        return payloads
    }
    bapChangePostSections(payloads){
        var obj = {
            "sections": DEMO["post_sections"],
        }
        payloads["changePostSections"] = obj
        //console.log(payloads)
        return payloads
    }
    changed(type){
        if(!IsR2){
            if (TBAR_CHANGES.length == 0){
                this.previewModeStart()
            }
            if (!TBAR_CHANGES.includes(type)){
                TBAR_CHANGES.push(type)
            }
        }
    }

    
    

}



class Robust{
    constructor(){
        this.pageChange()
        this.showSectionNames()
    }
    showSectionNames(){
      // var wrapper = $('.r2_p_sections_wrap')
      // var currentSections = ROUTER.urlParm('ds')
      // var st = []
      // if(currentSections){
      //   for(var item of currentSections.split('-')){
      //     st += `
      //     <p>${UCODE.code2sections[item]}</p>
      //     `
      //   }
      //   wrapper.append(st)
      // }
    }
    pageChange(){
      $('.page_select').change(function (){
        let d_page = $(this).val().substring(0,1).toLowerCase()
        PAGE = d_page
        //console.log(PAGE)
        let redirect_url = ROUTER.setUrl(true)
        window.location.href =  redirect_url
        //window.location.assign(redirect_url);
    })
    }
    initiateLoad(){
            clearInterval(PRELOAD_animation_interval)
            $('.p_wrap_out').removeClass('preloading')
            for (let i=0; i< 6;i++){
                clearInterval(interval_r[i])
            }
            $('.p_wrap_out').replaceWith(PRODUCT_LAYOUT)
            $(".toggle-sidebar").addClass('toggle-withr2')
            $('.r2_topbar').addClass('r2-wb')
            ROUTER.loadUrl()
            this.toggleButtons()
            this.addClassToPWrap()
    }
    toggleButtons(){
        // r2 sidebar
        $(".r2-toggle").click(() => {
          this.collapse_r2_sidebar()
        })
        $('button.toggle-sidebar.toggle-withr2').click(()=>{
            this.toggleMainBar()
        })
    }
    collapse_r2_sidebar() {
        $(".r2_sidebar").toggleClass('close-r2sidebar')
        $(".demos_bar").css("display", "none")
        if ($(".r2_sidebar").hasClass('close-r2sidebar')) {
          $(".r2-toggle").css("left", "0")
          $(".toggle-sidebar").removeClass('toggle-withr2')
          $('.r2_topbar').removeClass('r2-wb')
        } else {
          $(".r2-toggle").css("left", "250px")
          $(".toggle-sidebar").addClass('toggle-withr2')
          $('.r2_topbar').addClass('r2-wb')
        }
      }
      toggleMainBar(){
        $('.p_outline_out').toggleClass('close-sidebar')
        if ($('.p_outline_out').hasClass('close-sidebar')) {
          $('#section-p_header .section').addClass('main-sidebar-opened')
          $('.p_contant_out').addClass('main-sidebar-opened')
          $('.toggle-sidebar').addClass('sidebar-button-position')
        } else {
          $('.p_contant_out').removeClass('main-sidebar-opened')
          $('.toggle-sidebar').removeClass('sidebar-button-position')
          $('#section-p_header .section').removeClass('main-sidebar-opened')
        }    
      }
      addClassToPWrap(){
        $('.p_wrap_out').addClass(PAGE)
      }
}

//console.log('bap.js')
IsR2 = true
isBAP = true;
DEMO = {}
SIDEBAR_SETTINGS = {}
MHTML = {}
HOMEPAGE = 'dashboard'
$(document).ready(function (){
    function bap_initialize() {
        
        if (window.location.href.includes('kajabi.com')){
            IsR2 = false
            HOMEPAGE = 'index'
            PAGE = HOMEPAGE
            PAGE = $('.content > div').attr('data-dynamic-sections')
            //console.log("kajabi")
        }
        ROUTER = new Router()
        TOPBAR = new Topbar()
        DEMOS =  new Demos()
        LAYOUT = new Layout()
        COLORS = new Colors()
        DYNAMIC_SECTIONS = new DynamicSections()
        MINI_FUNCS = new MiniFuncs()
        BACKGROUND = new Background()
        HEADER = new Header()
        OUTLINE = new Outline()
        FEATURES = new Features()
        POST = new Post()
        SEARCH = new Search()
        SIDEBARS = new Sidebars()
        PROGRESS = new Progress()
        BADGES = new Badges()
        BUILD = new Build()
        ROBUST = new Robust()
        BAP = new Bap()

    }
    bap_initialize()
    window.addEventListener("pageshow", function() {
        ROUTER.setPageSelect()
    }, false);

    window.addEventListener("load", function(){
        if(!window.location.href.includes("kajabi.com")){
            setTimeout(function(){
                if (PAGE == 'dashboard'){
                    notific_write('Select a demo as your starting point. You will be able to change your demo at any time <span class="after_install_triger">after installing the template on your Kajabi account</span>')
                }
            }, 500)
        }
    })
    $('body').on('click','.hamburger-menu, .hamburger-menu-close',function(){
        $(this).toggleClass('open');
        $('.menu-links, body').toggleClass('open');
        if(!$('.menu-links').hasClass('open')){
            $('.hamburger-menu').removeClass('open');
        }
    });
    
})



class Bap{

    constructor(){
        this.sidebars_defaults()
        this.getMhtml()
        this.sidebarStyles()
    }


    sidebars_defaults(){

        let postPlaylist = 'd'
        let rof = 'r'
        if(ROUTER.urlParm('ps')){
            postPlaylist = ROUTER.urlParm('ps').split('-PL')[1].substring(0,1)
            rof = ROUTER.urlParm('ps').split('-RF')[1].substring(0,1)
        }
        
        let header = 'dl'
        if(ROUTER.urlParm('hd')){
        header = ROUTER.urlParm('hd')
        } else{
            //console.log('no header')
        }
        var mainSidebarPosition = 'l'
        var showSecondarySidebar = 't'
        var secondarySidebarPosition = 'r'
        var secondarySidebarStyle = 'r'
        if(ROUTER.urlParm('sb')){
            mainSidebarPosition = ROUTER.urlParm('sb').split('-MP')[1].substring(0,1)
            showSecondarySidebar = ROUTER.urlParm('sb').split('-SS')[1].substring(0,1)
            secondarySidebarPosition = ROUTER.urlParm('sb').split('-SP')[1].substring(0,1)
            secondarySidebarStyle = ROUTER.urlParm('sb').split('-SF')[1].substring(0,1)
        }
        SIDEBAR_SETTINGS = {
            dashboard:{
                showMainSidebar: '',
                mainSidebarPosition: '',
                header: header,
                showSecondarySidebar: showSecondarySidebar,
                secondarySidebarPosition: secondarySidebarPosition,
                secondarySidebarStyle: secondarySidebarStyle
            },
            post:{
                showMainSidebar: '',
                showSecondarySidebar: '',
                actionBarPosition: '',
                playerIcon: 'd',
                roundOrFlat: rof,
                playlist: postPlaylist
            }
        }
    }


    getMhtml(){
        var url = 'https://dev.robust-themes.com/njs/master_html.json?v=9.5'
        if (!isR2){
            url = ASSETS_PATH+'master_html.js?v=9.6'
        }
        $.getJSON({url: url,cache: true},function (data) {
            MHTML = data;
            //console.log("html Loaded")
            if(IsR2){
                setTimeout(function (){
                    if (!$('.r3_bar_toggle i').hasClass('fa-caret-down')){
                        TOPBAR.OpenTopar()
                    }
                },1000)
                ROBUST.initiateLoad()
            }
        })
    }

    sidebarStyles(){
        if(PAGE == 'post'){
            var styleSt = `
            .hide_on_post{
                display: none;
            }
            .main-content .sidebar.ssbar-right{
                margin-left: 10px;
              }
              .main-content .sidebar.ssbar-left{
                margin-right: 10px;
              }
            `
            $('.sidebar_styles').html(styleSt);
        } else{
            //console.log('post')
            var styleSt = `
                .show_only_on_post{
                    display: none;
                }
            `
            $('.sidebar_styles').html(styleSt);
        }
    }

    
}

R_logo = `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="" viewBox="0 0 124.249 27.991">
<g id="Group_473" data-name="Group 473" transform="translate(-271 -27.701)">
    <g id="Group_3" data-name="Group 3" transform="translate(271 27.701)">
        <path id="Path_5" data-name="Path 5" d="M18.524,7.836A5.179,5.179,0,0,0,14.853,6.3H0L21.685,27.989H26.98L20.512,21.52a11.62,11.62,0,0,0,2.471-1.884A11.508,11.508,0,0,0,14.853,0H0V3.636H14.853a7.86,7.86,0,0,1,5.558,13.429A7.932,7.932,0,0,1,17.8,18.8l-2.047-2.047,1.041-.424a5.264,5.264,0,0,0,1.735-1.154,5.164,5.164,0,0,0,0-7.343" transform="translate(0 0.001)" fill="rgb(11 53 88 / 78%)" fill-rule="evenodd"></path>
        <path id="Path_6" data-name="Path 6" d="M0,127.452l17.913,17.913H12.618L0,132.747Z" transform="translate(0 -117.375)" fill="rgb(11 53 88 / 78%)" fill-rule="evenodd"></path>
        <path id="Path_7" data-name="Path 7" d="M0,242.134l8.845,8.845H0Z" transform="translate(0 -222.989)" fill="#004CFF" fill-rule="evenodd"></path>
        <rect id="Rectangle_1" data-name="Rectangle 1" width="26.98" height="27.99" transform="translate(0 0)" fill="none"></rect>
    </g>
</g>
</svg>`

function notific_hide(){
    NOTIFIC_height = 0
    
    $('.r3_notific').css('height','0')
    $('.logo_r').html('')
    
    var height = '190px'
    if ($('.post_sections').hasClass('active')){
        height = '248px'
    }
    $('.r2_topbar,.r3_topbar').css('height',height)
    $('.p_wrap_out').css('padding-top',height)

}

NOTIFIC_height = 0
function notific_write(txt){
    if(!IsR2){ return }

    NOTIFIC_height = 24
    setTimeout(function (){
        $('.r3_notific').css('transition','height 0.3s ease-in')
        $('.r3_notific').css('height','30px')

        var topbar_height = '220px'
        if ($('div[tab="sections"]').hasClass('active')){
            topbar_height = '278px'
        }
        $('.r2_topbar,.r3_topbar').css('height',topbar_height)
        $('.p_wrap_out').css('padding-top',topbar_height)

        setTimeout(function (){
             $('.r3_notific').css('transition','height 0.0s ease-in')
             $('.logo_r').html(R_logo)
            },500)
    },300)
    
  
    var notific_elm = $('.notific_text')[0];
    var typewriter = new Typewriter(notific_elm, {
        delay: 20
    });

    typewriter
    .pauseFor(1000)
    .typeString(txt)
    .start();

}



