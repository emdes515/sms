'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile, X } from 'lucide-react';

interface EmojiPickerProps {
	onEmojiSelect: (emoji: string) => void;
	selectedEmoji?: string;
	className?: string;
}

const EMOJI_CATEGORIES = {
	people: [
		'😀',
		'😃',
		'😄',
		'😁',
		'😆',
		'😅',
		'🤣',
		'😂',
		'🙂',
		'🙃',
		'😉',
		'😊',
		'😇',
		'🥰',
		'😍',
		'🤩',
		'😘',
		'😗',
		'😚',
		'😙',
		'😋',
		'😛',
		'😜',
		'🤪',
		'😝',
		'🤑',
		'🤗',
		'🤭',
		'🤫',
		'🤔',
		'🤐',
		'🤨',
		'😐',
		'😑',
		'😶',
		'😏',
		'😒',
		'🙄',
		'😬',
		'🤥',
		'😔',
		'😪',
		'🤤',
		'😴',
		'😷',
		'🤒',
		'🤕',
		'🤢',
		'🤮',
		'🤧',
		'🥵',
		'🥶',
		'🥴',
		'😵',
		'🤯',
		'🤠',
		'🥳',
		'😎',
		'🤓',
		'🧐',
		'👶',
		'🧒',
		'👦',
		'👧',
		'🧑',
		'👨',
		'👩',
		'🧓',
		'👴',
		'👵',
		'👨‍💼',
		'👩‍💼',
		'👨‍🔬',
		'👩‍🔬',
		'👨‍💻',
		'👩‍💻',
		'👨‍🎨',
		'👩‍🎨',
	],
	objects: [
		'💼',
		'🎒',
		'👜',
		'👝',
		'🛍️',
		'🎁',
		'💎',
		'👑',
		'🎓',
		'🎩',
		'⛑️',
		'👒',
		'🧢',
		'👡',
		'👠',
		'👢',
		'👞',
		'👟',
		'🥾',
		'🥿',
		'🧦',
		'🧤',
		'🧣',
		'👔',
		'👕',
		'👖',
		'🧥',
		'👗',
		'👘',
		'👙',
		'💍',
		'💎',
		'👓',
		'🕶️',
		'🥽',
		'🌂',
		'☂️',
		'🧵',
		'🪡',
		'🧶',
	],
	activities: [
		'⚽',
		'🏀',
		'🏈',
		'⚾',
		'🥎',
		'🎾',
		'🏐',
		'🏉',
		'🎱',
		'🪀',
		'🏓',
		'🏸',
		'🏒',
		'🏑',
		'🥍',
		'🏏',
		'🪃',
		'🥅',
		'⛳',
		'🪁',
		'🏹',
		'🎣',
		'🤿',
		'🥊',
		'🥋',
		'🎽',
		'🛹',
		'🛷',
		'⛸️',
		'🥌',
		'🎿',
		'⛷️',
		'🏂',
		'🪂',
		'🏋️‍♀️',
		'🏋️‍♂️',
		'🤼‍♀️',
		'🤼‍♂️',
		'🤸‍♀️',
		'🤸‍♂️',
		'⛹️‍♀️',
		'⛹️‍♂️',
		'🤺',
		'🤾‍♀️',
		'🤾‍♂️',
		'🏌️‍♀️',
		'🏌️‍♂️',
		'🏇',
		'🧘‍♀️',
		'🧘‍♂️',
	],
	symbols: [
		'❤️',
		'🧡',
		'💛',
		'💚',
		'💙',
		'💜',
		'🖤',
		'🤍',
		'🤎',
		'💔',
		'❣️',
		'💕',
		'💞',
		'💓',
		'💗',
		'💖',
		'💘',
		'💝',
		'💟',
		'☮️',
		'✝️',
		'☪️',
		'🕉️',
		'☸️',
		'✡️',
		'🔯',
		'🕎',
		'☯️',
		'☦️',
		'🛐',
		'⛎',
		'♈',
		'♉',
		'♊',
		'♋',
		'♌',
		'♍',
		'♎',
		'♏',
		'♐',
		'♑',
		'♒',
		'♓',
		'🆔',
		'⚛️',
		'🉑',
		'☢️',
		'☣️',
		'📴',
		'📳',
	],
	nature: [
		'🌱',
		'🌿',
		'🍀',
		'🌾',
		'🌵',
		'🌲',
		'🌳',
		'🌴',
		'🌰',
		'🌱',
		'🌿',
		'🍀',
		'🌾',
		'🌵',
		'🌲',
		'🌳',
		'🌴',
		'🌰',
		'🌱',
		'🌿',
		'🍀',
		'🌾',
		'🌵',
		'🌲',
		'🌳',
		'🌴',
		'🌰',
		'🌱',
		'🌿',
		'🍀',
		'🌾',
		'🌵',
		'🌲',
		'🌳',
		'🌴',
		'🌰',
		'🌱',
		'🌿',
		'🍀',
		'🌾',
		'🌵',
		'🌲',
		'🌳',
		'🌴',
		'🌰',
		'🌱',
		'🌿',
		'🍀',
		'🌾',
		'🌵',
	],
};

export const EmojiPicker = ({
	onEmojiSelect,
	selectedEmoji = '',
	className = '',
}: EmojiPickerProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeCategory, setActiveCategory] = useState<keyof typeof EMOJI_CATEGORIES>('people');
	const pickerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleEmojiClick = (emoji: string) => {
		onEmojiSelect(emoji);
		setIsOpen(false);
	};

	const categoryLabels = {
		people: 'Ludzie',
		objects: 'Przedmioty',
		activities: 'Aktywności',
		symbols: 'Symbole',
		nature: 'Natura',
	};

	return (
		<div
			className={`relative ${className}`}
			ref={pickerRef}>
			{/* Trigger Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500">
				<Smile className="h-4 w-4" />
				<span className="text-lg">{selectedEmoji || '😀'}</span>
			</button>

			{/* Emoji Picker Dropdown */}
			{isOpen && (
				<div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
					{/* Header */}
					<div className="flex items-center justify-between p-3 border-b border-gray-200">
						<h3 className="text-sm font-medium text-gray-900">Wybierz emoji</h3>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="text-gray-400 hover:text-gray-600">
							<X className="h-4 w-4" />
						</button>
					</div>

					{/* Category Tabs */}
					<div className="flex border-b border-gray-200">
						{Object.keys(EMOJI_CATEGORIES).map((category) => (
							<button
								key={category}
								type="button"
								onClick={() => setActiveCategory(category as keyof typeof EMOJI_CATEGORIES)}
								className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
									activeCategory === category
										? 'text-primary-600 border-b-2 border-primary-600'
										: 'text-gray-500 hover:text-gray-700'
								}`}>
								{categoryLabels[category as keyof typeof EMOJI_CATEGORIES]}
							</button>
						))}
					</div>

					{/* Emoji Grid */}
					<div className="p-3 max-h-64 overflow-y-auto">
						<div className="grid grid-cols-8 gap-2">
							{EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
								<button
									key={index}
									type="button"
									onClick={() => handleEmojiClick(emoji)}
									aria-label={`Wybierz emoji: ${emoji}`}
									className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors">
									{emoji}
								</button>
							))}
						</div>
					</div>

					{/* Footer */}
					<div className="p-3 border-t border-gray-200 bg-gray-50">
						<p className="text-xs text-gray-500 text-center">Kliknij emoji aby wybrać</p>
					</div>
				</div>
			)}
		</div>
	);
};
