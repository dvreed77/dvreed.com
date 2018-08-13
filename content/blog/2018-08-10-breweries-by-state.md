---
title: Breweries by State
author: Dave
---

I wanted to know about stuff

First, I need to get all the data
```python
for p in range(1510):
    params = {
        'start': 20*p,
        'c_id': 'US'
    }
    page = requests.get('https://www.beeradvocate.com/place/list', params=params)

    with open(f'./beer_advocate/page_{p}.html', 'w') as fid:
        fid.write(str(page.content))
```

Then, some xpath magic

```python
get_name = lambda x: x[0].xpath('./td[1]')[0].text_content()
print(get_name(p))

get_address = lambda x: x[1].xpath("./td[1]/text()")[0]
print(get_address(p))

get_zip = lambda x: x[1].xpath("./td[1]/text()")[2].split(', ')[1]
print(tryf(get_zip, p))

get_city = lambda x: " ".join(x[1].xpath("./td[1]/a[1]/text()"))
print(tryf(get_city, p))

get_state = lambda x: " ".join(x[1].xpath("./td[1]/a[2]/text()"))
print(tryf(get_state, p))

get_country = lambda x: " ".join(x[1].xpath("./td[1]/a[3]/text()"))
print(tryf(get_country, p))

get_score = lambda x: x[0].xpath('./td[2]')[0].text_content()
print(tryf(get_score, p))

get_ratings = lambda x: x[0].xpath('./td[3]')[0].text_content()
print(tryf(get_ratings, p))

get_beer_avg = lambda x: x[0].xpath('./td[4]')[0].text_content()
print(tryf(get_beer_avg, p))

get_num_beers = lambda x: x[0].xpath('./td[5]')[0].text_content()
print(tryf(get_num_beers, p))
```

```python
out = []
for page_num in range(1510):
    page = get_page(page_num)
    places = get_places(page)
    for p in places:
        out.append({
            'name': get_name(p),
            'address': tryf(get_address, p),
            'city': tryf(get_city, p),
            'state': tryf(get_state, p),
            'country': tryf(get_country, p),
            'zip': tryf(get_zip, p),
            'score': get_score(p),
            'ratings': get_ratings(p),
            'beer_avg': get_beer_avg(p),
            'num_beers': get_num_beers(p),
        })

df = pd.DataFrame(out)
```

```python
df[(df.num_beers != '-')].groupby(['city', 'state']).size().sort_values(ascending=False).head(30)
```
**City**|**State**|**Count**
:-----:|:-----:|:-----:
Portland|Oregon|80
Denver|Colorado|77
San Diego|California|74
Chicago|Illinois|69
Seattle|Washington|67
Austin|Texas|43
Albuquerque|New Mexico|40
San Francisco|California|37
Minneapolis|Minnesota|36
Indianapolis|Indiana|35
Asheville|North Carolina|30
Los Angeles|California|29
Milwaukee|Wisconsin|28
Brooklyn|New York|26
Saint Louis|Missouri|26
Cincinnati|Ohio|26
Nashville|Tennessee|25
Columbus|Ohio|25
Colorado Springs|Colorado|25