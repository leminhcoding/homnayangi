"""Download attributed food photographs from Wikimedia Commons. Run explicitly to refresh assets."""
import urllib.request, urllib.parse, json, re, time
from pathlib import Path
UA = {'User-Agent': 'AnGiHanoi/1.0 (local educational food discovery website; photo attribution recorded)'}
def api(params):
 url='https://commons.wikimedia.org/w/api.php?'+urllib.parse.urlencode({'format':'json',**params})
 return json.load(urllib.request.urlopen(urllib.request.Request(url,headers=UA),timeout=35))
files={
'pho-bo':'Phở bò, Cầu Giấy, Hà Nội.jpg',
'pho-ga':'Street vendor pho ga Hanoi.jpg',
'bun-cha':'Bún chả Vietnamese food.jpg',
'bun-thang':'Bún thang.JPG',
'bun-dau':'Bún đậu mắm tôm (2019).jpg',
'bun-oc':'Street food in Hanoi.jpg',
'bun-rieu':'Bún riêu đặc biệt.jpg',
'cha-ca':'Chả cá Lã Vọng Hà Nội.jpg',
'banh-cuon':'Bánh cuốn Thanh Trì.jpg',
'banh-mi':'Bánh mì thịt nướng.png',
'xoi':'Xôi Gà Trứng Non Lạp Xướng (Sticky rice with chicken and eggs, and chinese sausages).jpg',
'mien-luon':'Mien luon Hang Dieu.JPG',
'banh-gio':'Bánh giò.jpg',
'banh-duc':'Banhduc-northern.jpg',
}
params={'action':'query','titles':'|'.join('File:'+f for f in files.values()),'prop':'imageinfo','iiprop':'url|extmetadata','iiurlwidth':1000}
r=api(params)
pages={p['title']:p for p in r['query']['pages'].values()}
manifest=[]
Path('public/food').mkdir(exist_ok=True)
for slug,name in files.items():
 p=pages.get('File:'+name,{})
 if not p.get('imageinfo'):print('MISSING',slug,name);continue
 info=p['imageinfo'][0];meta=info.get('extmetadata',{})
 url=info.get('thumburl') or info['url']
 # Keep the API thumbnail origin intact; substituting its hostname can break downloads.
 entry={'id':slug,'file':'/food/'+slug+'.jpg','original':info['url'],'download':url,'page':info['descriptionurl'],'artist':re.sub('<[^>]+>','',meta.get('Artist',{}).get('value','Wikimedia Commons')),'license':meta.get('LicenseShortName',{}).get('value',''),'licenseUrl':meta.get('LicenseUrl',{}).get('value',''),'description':re.sub('<[^>]+>','',meta.get('ImageDescription',{}).get('value',''))}
 manifest.append(entry)
 try:
  req=urllib.request.Request(url,headers=UA)
  blob=urllib.request.urlopen(req,timeout=30).read()
  Path('public/food/'+slug+'.jpg').write_bytes(blob)
  print('OK',slug,len(blob),entry['license'])
 except Exception as e:print('FAIL',slug,e)
 time.sleep(.35)
Path('research/photo-credits.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
for term in ['Bún cá','Phở cuốn','Bánh tôm','Bánh đúc nóng','Bun bo Nam Bo','Margherita','Udon beef']:
 try:
  d=api({'action':'query','list':'search','srsearch':term,'srnamespace':6,'srlimit':4})
  print('SEARCH',term,[v['title'] for v in d.get('query',{}).get('search',[])])
 except Exception as e:print('SEARCHFAIL',term,e)
 time.sleep(.4)
