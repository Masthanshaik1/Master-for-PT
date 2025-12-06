FROM justb4/jmeter:5.6.3

# Copy all plugins into JMeter lib/ext
COPY jmeter-plugins/*.jar /opt/apache-jmeter-5.6.3/lib/ext/

# Optional: Copy CSV files if needed
COPY *.csv /opt/apache-jmeter-5.6.3/bin/
