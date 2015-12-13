function init(db) {
	util.render(contents());
}

	function contents() {
		return util.html(function() {/*!html
			<h1>FAQ</h1>

			<div class="filler"></div>

			<h3>How do I view another student's timetable?</h3>
			<p>Open Skedular in an Incognito tab. Proceed as usual.</p>

			<hr>

			<h3>What is Sync?</h3>
			<p>Sync is a new feature which keeps your data consistent across all your devices. It uses a password-like key which ensures only you have access to your data.</p>

			<hr>

			<h3>Why don't you have an iOS App?</h3>

			<a href="http://www.pcadvisor.co.uk/how-to/mobile-phone/3447887/add-bookmarks-home-screen-on-iphone-ipad/">Because it costs $99/year. Click for a suitable alternative</a>

			<hr>

			<h3>I keep getting logged out of the app</h3>
			<p>If you are running Android 4.3 and lower, this is a known bug affecting mostly Samsung phones. In order to use Sync & to stay logged in, you must add to homescreen using Chrome.</p>

			<hr>

			<h3>Swipe doesn't open the side-menu</h3>
			<p>Chances are you're running an outdated version of Android. This is a known issue, the only fix is updating or using Google Chrome for Android</p>

			<hr>

			<h3>I'd like to help <i class="fa fa-heart"></i></h3>
			<p>Buy me a coffee <3</p>
		*/})
	}