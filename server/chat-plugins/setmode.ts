export const commands: Chat.ChatCommands = {
	/**
	 /setmode [text] - send a `|rated|...` banner into the current battle room
	 accepts either the raw protocol string ("|rated|35 Premier League")
	 or just the text ("35 Premier League")
	 requires driver+
	*/
	setmode(target, room, user) {
		room = this.requireRoom();
		if (!room.battle) {
			throw new Chat.ErrorMessage(`/setmode must be used in a battle room.`);
		}

		const userRank = room.auth.getDirect(user.id);
		if (!Users.Auth.atLeast(userRank, '%')) {
			throw new Chat.ErrorMessage(`/setmode requires Driver (%) or higher.`);
		}

		if (!target) return this.parse('/help setmode');

		let message = target.trim();
		if (!message.startsWith('|')) {
			message = `|rated|${message}`;
		}

		room.add(message).update();

		this.addGlobalModAction(`${user.name} used /setmode ${target}`);
		this.globalModlog(`SETMODE`, null, target);
	},
	setmodehelp: [
		`/setmode [text] - Adds the given text as a banner in the current battle room. If you provide plain text, it will be sent as \`|rated|<text>\`. Requires: driver (%) in the room.`,
	],
};
