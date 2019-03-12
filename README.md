# beltrade
## Building
- change version in <i>config.xml</i>
- <code>cordova clean</code>
- Run in root folder <code>ionic cordova build android --prod --release</code>
- <code>cd $HOME/Projects/navispy/platforms/android/app/build/outputs/apk/release/</code>
- <code>jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ~/Projects/navispy/android.jks app-release-unsigned.apk key0</code>
- KEYSTORE PASSWORD: DellGL5100
- <code>zipalign -v 4 app-release-unsigned.apk Skymonitor.apk</code>