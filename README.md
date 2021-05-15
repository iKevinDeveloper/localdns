# zapdns
[![License](https://img.shields.io/github/license/JoeBiellik/localdns.svg)](LICENSE.md)
[![Release Version](https://img.shields.io/github/release/JoeBiellik/localdns.svg)](https://github.com/iKevinDeveloper/localdns/releases)

## Usage
You can simply login to the website and manage your subdomain and IP address there or you can use the simple HTTP API to update your IP with a script or dynamic DNS client.

### Cron
The easiest way to keep your mapping up to date is to add the following line to your crontab which will update your IP every three hours:
```
0 */3 * * * curl -u 'USERNAME:PASSWORD' http://zapdns.xyz/update
```

### ddclient
You can use [ddclient](https://github.com/ddclient/ddclient) to keep your IP address up to date with the following config:
```
server=zapdns.xyz, \
protocol=dyndns2,   \
login=USERNAME,     \
password=PASSWORD   \
SUBDOMAIN.zapdns.xyz
```

### DD-WRT
Routers running DD-WRT can update your IP address by using the built in dynamic DNS settings found under Setup &rarr; DDNS. Other routers may also work but are untested.
```
DDNS Service: Custom
DYNDNS Server: zapdns.xyz
Username: USERNAME
Password: PASSWORD
Hostname: SUBDOMAIN.zapdns.xyz
URL: /nic/update?hostname=
```
