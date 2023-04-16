# docker pull voicevox/voicevox_engine
docker run --rm --gpus all -p '127.0.0.1:50021:50021' voicevox/voicevox_engine:nvidia-ubuntu20.04-latest
# Start-Process -FilePath "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" -ArgumentList "--disable-web-security --user-data-dir=H:\tmp --disable-extensions"
Start-Process -FilePath "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" -ArgumentList "--disable-web-security --user-data-dir=H:\tmp"
# Start-Process -FilePath "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" -ArgumentList "--disable-features=AudioServiceOutOfProcess,WinSboxDisableExtensionPoint --restore-last-session --flag-switches-begin --flag-switches-end --disable-web-security --user-data-dir=H:\tmp"