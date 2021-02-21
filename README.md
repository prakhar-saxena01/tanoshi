[![Release Stats](https://img.shields.io/github/downloads/faldez/tanoshi/total.svg?logo=github)](https://somsubhra.com/github-release-stats/?username=faldez&repository=tanoshi)

# Tanoshi
Selfhosted web manga reader with extension model.

## Feature
- Browse manga from various sources (only mangadex and local for now)
- Read in continous vertical, single or double paged
- Read from right to left or right to left
- Fit image to width, height or original size
- Favorite manga for faster access

## Usage
Run using
```
./tanoshi-{os}-{arch} -config /path/to/config.yml
```
Default config can be fount at [configs/config.yml](configs/config.yml)

for local manga, directory structure needs to be
```
/path/to/manga
|_ Series 1
|   |_ Series 1 Chapter1.cbz
|   |_ Series 1 Chapter2.cbz
|_ Series 2
    |_ Series 2 Chapter1.cbz
    |_ Series 2 Chapter2.cbz    
```

## Linux autostart
systemd service example
```
[Unit]
Description=Selfhosted web manga reader

[Service]
ExecStart=/usr/local/bin/tanoshi-linux-amd64
User=User

[Install]
WantedBy=multi-user.target
```

## Screenshot
![](assets/Screen%20Shot%202021-01-31%20at%2016.20.38.png)
![](assets/Screen%20Shot%202021-01-31%20at%2016.23.41.png)
![](assets/Screen%20Shot%202021-01-31%20at%2016.20.34.png)

<img src="assets/IMG_73577C410A56-1.jpeg" width="250">
<img src="assets/IMG_3436B10A2508-1.jpeg" width="250">
<img src="assets/IMG_B8461880E874-1.jpeg" width="250">
