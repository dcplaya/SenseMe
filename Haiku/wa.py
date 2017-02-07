import flask
from sensemefan import SenseMeFan

# Statically assign the fan? Probably not, but you would do it this way:
# fan = SenseMeFan('192.168.1.112', 'Living Room Fan')
fan = SenseMeFan()

app = flask.Flask(__name__)
app.secret_key = '12839-hidf;safng1jjdsgaklgxzcvzxdsfa125asklvnke1pht32532r'


@app.route("/")
def index():
    # return flask.send_from_directory('./static/', 'index.html')
    flask.flash(fan.fan_speed)
    return flask.render_template('index.html')


################################################################################
# Light Functions
################################################################################
@app.route("/light/toggle")
def togglelight():
    fan.lighttoggle()
    flask.flash('Toggling Light')
    return flask.redirect(flask.url_for('index'))


@app.route("/light/off")
def lightoff():
    fan.lightoff()
    flask.flash('Turning Light Off')
    return flask.redirect(flask.url_for('index'))


@app.route("/light/on")
def lighton():
    fan.lighton()
    flask.flash('Turning light On')
    return flask.redirect(flask.url_for('index'))


@app.route("/light/<int:level>")
def llevel(level):
    fan.setlight(int(level))
    flask.flash('Set light level to {}'.format(level))
    return flask.redirect(flask.url_for('index'))


@app.route("/light/increase")
def inclight():
    fan.inclight()
    flask.flash('Increased Light Level')
    return flask.redirect(flask.url_for('index'))


@app.route("/light/decrease")
def declight():
    fan.declight()
    flask.flash('Decreased Light Level')
    return flask.redirect(flask.url_for('index'))


################################################################################
# Fan Functions
################################################################################
@app.route("/fan/increase")
def incspeed():
    fan.incspeed()
    flask.flash('Increased Fan Speed')
    return flask.redirect(flask.url_for('index'))


@app.route("/fan/decrease")
def decspeed():
    fan.decspeed()
    flask.flash('Decreased Fan Speed')
    return flask.redirect(flask.url_for('index'))


@app.route("/fan/<int:speed>")
def setspeed(speed):
    fan.setlight(int(speed))
    flask.flash('Set fan speed to {}'.format(speed))
    return flask.redirect(flask.url_for('index'))


@app.route("/fan/toggle")
def fantoggle():
    fan.fantoggle()
    flask.flash('Toggling Fan')
    return flask.redirect(flask.url_for('index'))
##################################################################################


if __name__ == '__main__':
    app.run()
